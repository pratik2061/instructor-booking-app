import type { Types } from "mongoose";

export enum AvailabilityStatus {
    AVAILABLE = "available",
    HELD = "held",
    BOOKED = "booked",
}

export interface IAvailability {
    instructorId: Types.ObjectId;
    startAt: Date;
    endAt: Date;
    status: AvailabilityStatus;
    bookingId?: Types.ObjectId;
    holdExpiresAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}