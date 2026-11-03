export type InstructorCurrency = "NPR" | "USD";

export interface InstructorUser {
    _id: string;
    name: string;
}

export interface Instructor {
    _id: string;
    userId: string | InstructorUser;
    bio: string;
    expertise: string[];
    consultationFee: number;
    currency: InstructorCurrency;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
    updatedAt: string;
}

export interface InstructorPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface InstructorListResponse {
    success: boolean;
    message: string;
    data: {
        instructors: Instructor[];
        pagination: InstructorPagination;
    };
}

export interface InstructorResponse {
    success: boolean;
    message: string;
    data: {
        profile: Instructor;
    };
}

export interface CreateProfilePayload {
    bio: string;
    expertise: string[];
    consultationFee: number;
    currency: InstructorCurrency;
}

export type UpdateProfilePayload = Partial<CreateProfilePayload>;