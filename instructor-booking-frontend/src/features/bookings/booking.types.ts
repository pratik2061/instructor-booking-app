import type { InstructorCurrency } from "../instructor/instructor.types";


export interface BookingStudent {
    _id: string;
    name: string;
    email: string;
}
export type BookingStatus =
    | "pending_payment"
    | "confirmed"
    | "cancelled"
    | "completed";

export interface BookingInstructorUser {
    _id: string;
    name: string;
    email?: string;
}

export interface BookingInstructor {
    _id: string;
    userId: string | BookingInstructorUser;
    bio: string;
    expertise: string[];
    consultationFee: number;
    currency: InstructorCurrency;
}

export interface Booking {
    _id: string;
    studentId: string | BookingStudent;
    instructorId: string | BookingInstructor;
    availabilityId: string;
    startAt: string;
    endAt: string;
    consultationFee: number;
    currency: InstructorCurrency;
    status: BookingStatus;
    meetingLink?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BookingPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface BookingListResponse {
    success: boolean;
    message: string;
    data: {
        bookings: Booking[];
        pagination: BookingPagination;
    };
}