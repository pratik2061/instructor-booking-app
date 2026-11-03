import type { Types } from "mongoose";

export enum BookingStatus {
    PENDING_PAYMENT = "pending_payment",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    COMPLETED = "completed",
}

export interface IBooking {
    studentId: Types.ObjectId;
    instructorId: Types.ObjectId;
    availabilityId: Types.ObjectId;

    startAt: Date;
    endAt: Date;

    consultationFee: number;
    currency: string;

    status: BookingStatus;
    meetingLink?: string;

    createdAt?: Date;
    updatedAt?: Date;
}