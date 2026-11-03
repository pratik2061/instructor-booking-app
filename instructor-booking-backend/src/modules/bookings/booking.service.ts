import mongoose from "mongoose";

import Booking from "./booking.model.js";
import Availability from "../availability/availability.model.js";
import InstructorProfile from "../instructors/instructor.model.js";

import { BookingStatus } from "./booking.types.js";
import { AvailabilityStatus } from "../availability/availability.types.js";
import { InstructorStatus } from "../instructors/instructor.types.js";
import { UserRole } from "../users/user.types.js";

import type { BookingQuery } from "./booking.validation.js";

import ApiError from "../../utils/ApiError.js";
import User from "../users/user.modules.js";

class BookingService {
    // Create a booking.
    async createBooking(studentId: string, availabilityId: string) {
        const session = await mongoose.startSession();

        let createdBooking: InstanceType<typeof Booking> | null = null;

        try {
            await session.withTransaction(async () => {
                // Verify the student exists and is active.
                const student = await User.findById(studentId).session(session);

                if (!student || !student.isActive) {
                    throw new ApiError(404, "Student account not found or inactive");
                }

                if (student.role !== UserRole.STUDENT) {
                    throw new ApiError(403, "Only students can create bookings");
                }

                // Atomically reserve the slot.
                // Only one request can change AVAILABLE to BOOKED.
                const slot = await Availability.findOneAndUpdate(
                    {
                        _id: availabilityId,
                        status: AvailabilityStatus.AVAILABLE,
                        startAt: { $gt: new Date() },
                    },
                    {
                        $set: {
                            status: AvailabilityStatus.BOOKED,
                        },
                    },
                    {
                        new: true,
                        session,
                    }
                );

                if (!slot) {
                    throw new ApiError(
                        409,
                        "This slot is no longer available or has already started"
                    );
                }

                // Verify that the instructor profile is still approved.
                const instructor = await InstructorProfile.findOne({
                    _id: slot.instructorId,
                    status: InstructorStatus.APPROVED,
                }).session(session);

                if (!instructor) {
                    throw new ApiError(404, "Approved instructor not found");
                }

                // Create the booking using server-side information.
                const newBookingId = new mongoose.Types.ObjectId();
                const bookings = await Booking.create(
                    [
                        {
                            _id: newBookingId,
                            studentId: student._id,
                            instructorId: instructor._id,
                            availabilityId: slot._id,
                            startAt: slot.startAt,
                            endAt: slot.endAt,
                            consultationFee: instructor.consultationFee,
                            currency: instructor.currency,
                            status: BookingStatus.CONFIRMED,
                            meetingLink: `https://meet.jit.si/instructor-call-${newBookingId.toString()}`,
                        },
                    ],
                    { session }
                );

                createdBooking = bookings[0] ?? null;
            });

            if (!createdBooking) {
                throw new ApiError(500, "Unable to create booking");
            }

            return createdBooking;
        } finally {
            await session.endSession();
        }
    }

    // Get booking history for the logged-in student.
    async getMyBookings(
        studentId: string,
        query: BookingQuery
    ) {
        const { page, limit, status } = query;
        const skip = (page - 1) * limit;

        const studentObjectId = new mongoose.Types.ObjectId(studentId);

        // Build the bookings query.
        const bookingsQuery = Booking.find()
            .where("studentId")
            .equals(studentObjectId);

        // Apply status filter only when provided.
        if (status) {
            bookingsQuery.where("status").equals(status);
        }

        // Build the count query.
        const countQuery = Booking.countDocuments()
            .where("studentId")
            .equals(studentObjectId);

        if (status) {
            countQuery.where("status").equals(status);
        }

        const [bookings, total] = await Promise.all([
            bookingsQuery
                .populate({
                    path: "instructorId",
                    populate: {
                        path: "userId",
                        select: "name email",
                    },
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            countQuery,
        ]);

        return {
            bookings,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1,
            },
        };
    }

    // Cancel a future booking and release its slot.
    async cancelBooking(studentId: string, bookingId: string) {
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            throw new ApiError(400, "Invalid booking ID");
        }

        const session = await mongoose.startSession();

        let cancelledBooking: InstanceType<typeof Booking> | null = null;

        try {
            await session.withTransaction(async () => {
                // Only the owner can cancel their confirmed future booking.
                const booking = await Booking.findOneAndUpdate(
                    {
                        _id: bookingId,
                        studentId,
                        status: BookingStatus.CONFIRMED,
                        startAt: { $gt: new Date() },
                    },
                    {
                        $set: {
                            status: BookingStatus.CANCELLED,
                        },
                    },
                    {
                        new: true,
                        session,
                    }
                );

                if (!booking) {
                    throw new ApiError(
                        404,
                        "Booking not found or it cannot be cancelled"
                    );
                }

                // Release the slot so another student can book it.
                const releasedSlot = await Availability.findOneAndUpdate(
                    {
                        _id: booking.availabilityId,
                        status: AvailabilityStatus.BOOKED,
                    },
                    {
                        $set: {
                            status: AvailabilityStatus.AVAILABLE,
                        },
                    },
                    {
                        new: true,
                        session,
                    }
                );

                if (!releasedSlot) {
                    throw new ApiError(
                        409,
                        "Unable to release the availability slot"
                    );
                }

                cancelledBooking = booking;
            });

            if (!cancelledBooking) {
                throw new ApiError(500, "Unable to cancel booking");
            }

            return cancelledBooking;
        } finally {
            await session.endSession();
        }
    }

    // Get booking history for the logged-in instructor.
    async getInstructorBookings(
        instructorUserId: string,
        query: BookingQuery
    ) {
        const { page, limit, status } = query;
        const skip = (page - 1) * limit;

        // Find the instructor profile associated with the logged-in user.
        const instructor = await InstructorProfile.findOne({
            userId: instructorUserId,
        });

        if (!instructor) {
            throw new ApiError(404, "Instructor profile not found");
        }

        // Find bookings associated with this instructor profile.
        const bookingsQuery = Booking.find({
            instructorId: instructor._id,
        });

        if (status) {
            bookingsQuery.where("status").equals(status);
        }

        // Count matching bookings.
        const countQuery = Booking.countDocuments({
            instructorId: instructor._id,
        });

        if (status) {
            countQuery.where("status").equals(status);
        }

        const [bookings, total] = await Promise.all([
            bookingsQuery
                .populate("studentId", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            countQuery,
        ]);

        return {
            bookings,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1,
            },
        };
    }
}

export default new BookingService();