import { Types } from "mongoose";

export enum InstructorStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
}

export enum Currency {
    NPR = "NPR",
    USD = "USD",
}


export interface IInstructorProfile {
    userId: Types.ObjectId;

    bio: string;
    expertise: string[];

    consultationFee: number;
    currency: Currency;

    status: InstructorStatus;

    createdAt: Date;
    updatedAt: Date;
}