import type { Types } from "mongoose";

export enum PaymentProvider {
    STRIPE = "stripe",
}

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
    REFUNDED = "refunded",
}

export interface IPayment {
    bookingId: Types.ObjectId;
    studentId: Types.ObjectId;

    provider: PaymentProvider;
    amount: number;
    currency: string;

    status: PaymentStatus;

    stripeCheckoutSessionId?: string;
    stripePaymentIntentId?: string;

    checkoutUrl?: string;
    expiresAt: Date;

    createdAt?: Date;
    updatedAt?: Date;
}