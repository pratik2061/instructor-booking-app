import mongoose, { Schema, type Model } from "mongoose";

import {
    PaymentProvider,
    PaymentStatus,
    type IPayment,
} from "./payment.types.js";

const paymentSchema = new Schema<IPayment>(
    {
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            unique: true,
        },

        studentId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        provider: {
            type: String,
            enum: Object.values(PaymentProvider),
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isSafeInteger,
                message: "Payment amount must be a safe integer",
            },
        },

        currency: {
            type: String,
            required: true,
            lowercase: true,
            enum: ["npr", "usd"],
        },

        status: {
            type: String,
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.PENDING,
        },

        stripeCheckoutSessionId: {
            type: String,
            unique: true,
            sparse: true,
        },

        stripePaymentIntentId: {
            type: String,
            sparse: true,
        },

        checkoutUrl: {
            type: String,
        },

        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

paymentSchema.index({
    studentId: 1,
    createdAt: -1,
});

const Payment: Model<IPayment> = mongoose.model<IPayment>(
    "Payment",
    paymentSchema
);

export default Payment;