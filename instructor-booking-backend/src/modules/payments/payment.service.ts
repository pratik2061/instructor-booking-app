import mongoose from "mongoose";
import type Stripe from "stripe";

import stripe from "../../config/stripe.js";
import { env } from "../../config/environment.js";

import Availability from "../availability/availability.model.js";
import { AvailabilityStatus } from "../availability/availability.types.js";

import Booking from "../bookings/booking.model.js";
import { BookingStatus } from "../bookings/booking.types.js";

import InstructorProfile from "../instructors/instructor.model.js";
import { InstructorStatus } from "../instructors/instructor.types.js";

import Payment from "./payment.model.js";
import { PaymentProvider, PaymentStatus } from "./payment.types.js";

import ApiError from "../../utils/ApiError.js";
import type { CreateCheckoutInput } from "./payment.validation.js";

const HOLD_DURATION_MINUTES = 30;

class PaymentService {
    async createCheckoutSession(
        studentId: string,
        input: CreateCheckoutInput,
    ) {
        const session = await mongoose.startSession();

        const expiresAt = new Date(
            Date.now() + HOLD_DURATION_MINUTES * 60 * 1000,
        );

        // Return IDs from the transaction callback instead of assigning outer
        // variables inside the callback. TypeScript can then infer their types.
        let transactionResult:
            | {
                bookingId: mongoose.Types.ObjectId;
                paymentId: mongoose.Types.ObjectId;
            }
            | undefined;

        try {
            transactionResult = await session.withTransaction(async () => {
                const studentObjectId = new mongoose.Types.ObjectId(studentId);
                const availabilityObjectId = new mongoose.Types.ObjectId(
                    input.availabilityId,
                );

                // 1. Find the requested future availability slot.
                const availability = await Availability.findOne({
                    _id: availabilityObjectId,
                    status: AvailabilityStatus.AVAILABLE,
                    startAt: { $gt: new Date() },
                }).session(session);

                if (!availability) {
                    throw new ApiError(
                        409,
                        "This availability slot is no longer available.",
                    );
                }

                // 2. Find the approved instructor profile.
                const instructor = await InstructorProfile.findOne({
                    _id: availability.instructorId,
                    status: InstructorStatus.APPROVED,
                }).session(session);

                if (!instructor) {
                    throw new ApiError(404, "Instructor not found or not approved.");
                }

                // 3. Atomically hold the availability slot.
                const heldSlot = await Availability.findOneAndUpdate(
                    {
                        _id: availability._id,
                        status: AvailabilityStatus.AVAILABLE,
                    },
                    {
                        $set: {
                            status: AvailabilityStatus.HELD,
                            holdExpiresAt: expiresAt,
                        },
                    },
                    {
                        new: true,
                        session,
                    },
                );

                if (!heldSlot) {
                    throw new ApiError(
                        409,
                        "This availability slot has already been reserved.",
                    );
                }

                // 4. Create a booking that is not confirmed until Stripe verifies payment.
                const [booking] = await Booking.create(
                    [
                        {
                            studentId: studentObjectId,
                            instructorId: instructor._id,
                            availabilityId: availability._id,
                            startAt: availability.startAt,
                            endAt: availability.endAt,
                            consultationFee: instructor.consultationFee,
                            currency: instructor.currency,
                            status: BookingStatus.PENDING_PAYMENT,
                        },
                    ],
                    { session },
                );

                // Link the held slot to this booking.
                await Availability.updateOne(
                    { _id: heldSlot._id },
                    { $set: { bookingId: booking._id } },
                    { session },
                );

                // 5. Create the pending payment record.
                const [payment] = await Payment.create(
                    [
                        {
                            bookingId: booking._id,
                            studentId: studentObjectId,
                            provider: PaymentProvider.STRIPE,
                            amount: instructor.consultationFee,
                            currency: instructor.currency.toLowerCase(),
                            status: PaymentStatus.PENDING,
                            expiresAt,
                        },
                    ],
                    { session },
                );

                return {
                    bookingId: booking._id,
                    paymentId: payment._id,
                };
            });
        } finally {
            await session.endSession();
        }

        if (!transactionResult) {
            throw new ApiError(500, "Unable to create payment.");
        }

        const { bookingId, paymentId } = transactionResult;

        try {
            // 6. Create the Stripe Checkout Session outside the DB transaction.
            const payment = await Payment.findById(paymentId);

            if (!payment) {
                throw new ApiError(404, "Payment record not found.");
            }

            const checkoutSession = await stripe.checkout.sessions.create(
                {
                    mode: "payment",

                    // Do not set payment_method_types here. This Stripe SDK version
                    // does not expose that property in SessionCreateParams.
                    // Stripe will use the payment methods configured for Checkout.

                    line_items: [
                        {
                            price_data: {
                                currency: payment.currency,
                                product_data: {
                                    name: "30-minute Instructor Consultation",
                                },
                                unit_amount: payment.amount,
                            },
                            quantity: 1,
                        },
                    ],

                    metadata: {
                        bookingId: bookingId.toString(),
                        paymentId: paymentId.toString(),
                        studentId,
                    },

                    success_url: `${env.PAYMENT_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: env.PAYMENT_CANCEL_URL,
                    expires_at: Math.floor(expiresAt.getTime() / 1000),
                },
                {
                    idempotencyKey: `checkout-${paymentId.toString()}`,
                },
            );

            if (!checkoutSession.url) {
                throw new ApiError(502, "Stripe did not return a checkout URL.");
            }

            // 7. Save the Stripe session details.
            const updatedPayment = await Payment.findOneAndUpdate(
                {
                    _id: paymentId,
                    status: PaymentStatus.PENDING,
                },
                {
                    $set: {
                        stripeCheckoutSessionId: checkoutSession.id,
                        checkoutUrl: checkoutSession.url,
                    },
                },
                { new: true },
            );

            if (!updatedPayment) {
                throw new ApiError(409, "Unable to save the Stripe checkout session.");
            }

            return {
                bookingId: bookingId.toString(),
                paymentId: paymentId.toString(),
                checkoutUrl: checkoutSession.url,
                sessionId: checkoutSession.id,
            };
        } catch (error) {
            // If Stripe session creation or persistence fails, release the held
            // slot and cancel the pending booking/payment.
            await this.releasePendingBooking(bookingId, paymentId);
            throw error;
        }
    }

    private async releasePendingBooking(
        bookingId: mongoose.Types.ObjectId,
        paymentId: mongoose.Types.ObjectId,
    ) {
        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const booking = await Booking.findOneAndUpdate(
                    {
                        _id: bookingId,
                        status: BookingStatus.PENDING_PAYMENT,
                    },
                    {
                        $set: { status: BookingStatus.CANCELLED },
                    },
                    {
                        new: true,
                        session,
                    },
                );

                await Payment.updateOne(
                    {
                        _id: paymentId,
                        status: PaymentStatus.PENDING,
                    },
                    {
                        $set: { status: PaymentStatus.FAILED },
                    },
                    { session },
                );

                if (booking) {
                    await Availability.updateOne(
                        {
                            _id: booking.availabilityId,
                            bookingId: booking._id,
                            status: AvailabilityStatus.HELD,
                        },
                        {
                            $set: { status: AvailabilityStatus.AVAILABLE },
                            $unset: {
                                bookingId: "",
                                holdExpiresAt: "",
                            },
                        },
                        { session },
                    );
                }
            });
        } finally {
            await session.endSession();
        }
    }

    async handleCheckoutCompleted(stripeSession: Stripe.Checkout.Session) {
        if (stripeSession.payment_status !== "paid") {
            return;
        }

        const { bookingId, paymentId, studentId } = stripeSession.metadata ?? {};

        if (!bookingId || !paymentId || !studentId) {
            throw new ApiError(400, "Missing checkout session metadata.");
        }

        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const payment = await Payment.findById(paymentId).session(session);

                if (
                    !payment ||
                    payment.bookingId.toString() !== bookingId ||
                    payment.studentId.toString() !== studentId ||
                    payment.stripeCheckoutSessionId !== stripeSession.id
                ) {
                    throw new ApiError(400, "Invalid payment session.");
                }

                // Stripe may deliver the same webhook more than once.
                if (payment.status === PaymentStatus.PAID) {
                    return;
                }

                if (
                    payment.status !== PaymentStatus.PENDING ||
                    stripeSession.amount_total !== payment.amount ||
                    stripeSession.currency !== payment.currency
                ) {
                    throw new ApiError(400, "Payment details do not match.");
                }

                const booking = await Booking.findOneAndUpdate(
                    {
                        _id: bookingId,
                        studentId,
                        status: BookingStatus.PENDING_PAYMENT,
                    },
                    {
                        $set: {
                            status: BookingStatus.CONFIRMED,
                            meetingLink: `https://meet.jit.si/instructor-call-${bookingId}`,
                        },
                    },
                    {
                        new: true,
                        session,
                    },
                );

                if (!booking) {
                    throw new ApiError(
                        409,
                        "Pending booking not found. Payment requires reconciliation.",
                    );
                }

                const availability = await Availability.findOneAndUpdate(
                    {
                        _id: booking.availabilityId,
                        bookingId: booking._id,
                        status: AvailabilityStatus.HELD,
                    },
                    {
                        $set: { status: AvailabilityStatus.BOOKED },
                        $unset: { holdExpiresAt: "" },
                    },
                    {
                        new: true,
                        session,
                    },
                );

                if (!availability) {
                    throw new ApiError(
                        409,
                        "Held availability slot not found. Payment requires reconciliation.",
                    );
                }

                await Payment.updateOne(
                    {
                        _id: payment._id,
                        status: PaymentStatus.PENDING,
                    },
                    {
                        $set: {
                            status: PaymentStatus.PAID,
                            stripePaymentIntentId:
                                typeof stripeSession.payment_intent === "string"
                                    ? stripeSession.payment_intent
                                    : stripeSession.payment_intent?.id,
                        },
                    },
                    { session },
                );
            });
        } finally {
            await session.endSession();
        }
    }

    async handleCheckoutExpired(stripeSession: Stripe.Checkout.Session) {
        const { bookingId, paymentId } = stripeSession.metadata ?? {};

        if (!bookingId || !paymentId) {
            throw new ApiError(400, "Missing checkout session metadata.");
        }

        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const payment = await Payment.findOne({
                    _id: paymentId,
                    bookingId,
                    stripeCheckoutSessionId: stripeSession.id,
                }).session(session);

                if (!payment || payment.status !== PaymentStatus.PENDING) {
                    return;
                }

                const booking = await Booking.findOneAndUpdate(
                    {
                        _id: bookingId,
                        status: BookingStatus.PENDING_PAYMENT,
                    },
                    {
                        $set: { status: BookingStatus.CANCELLED },
                    },
                    {
                        new: true,
                        session,
                    },
                );

                await Payment.updateOne(
                    {
                        _id: payment._id,
                        status: PaymentStatus.PENDING,
                    },
                    {
                        $set: { status: PaymentStatus.FAILED },
                    },
                    { session },
                );

                if (booking) {
                    await Availability.updateOne(
                        {
                            _id: booking.availabilityId,
                            bookingId: booking._id,
                            status: AvailabilityStatus.HELD,
                        },
                        {
                            $set: { status: AvailabilityStatus.AVAILABLE },
                            $unset: {
                                bookingId: "",
                                holdExpiresAt: "",
                            },
                        },
                        { session },
                    );
                }
            });
        } finally {
            await session.endSession();
        }
    }

    async verifySession(
        sessionId: string,
        studentId: string,
    ): Promise<{
        status: string;
        booking: unknown;
        payment: unknown;
    }> {
        if (!sessionId) {
            throw new ApiError(400, "Session ID is required.");
        }

        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

        if (!stripeSession) {
            throw new ApiError(404, "Stripe checkout session not found.");
        }

        const metadata = stripeSession.metadata ?? {};
        if (metadata.studentId && metadata.studentId !== studentId) {
            throw new ApiError(403, "You are not authorized to verify this session.");
        }

        if (stripeSession.payment_status === "paid") {
            await this.handleCheckoutCompleted(stripeSession);
        }

        const booking = metadata.bookingId
            ? await Booking.findById(metadata.bookingId).populate({
                path: "instructorId",
                populate: {
                    path: "userId",
                    select: "name email",
                },
            })
            : null;

        const payment = metadata.paymentId
            ? await Payment.findById(metadata.paymentId)
            : await Payment.findOne({ stripeCheckoutSessionId: sessionId });

        return {
            status: stripeSession.payment_status,
            booking,
            payment,
        };
    }
}

export default new PaymentService();
