
export type AvailabilityStatus =
    | "available"
    | "held"
    | "booked";

export interface AvailabilitySlot {
    _id: string;
    instructorId: string;
    startAt: string;
    endAt: string;
    startTime?: string;
    endTime?: string;
    status: AvailabilityStatus;
    bookingId?: string | null;
    holdExpiresAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface AvailabilityPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface AvailabilityListResponse {
    success: boolean;
    message: string;
    data: {
        slots: AvailabilitySlot[];
        pagination: AvailabilityPagination;
    };
}

export interface CreateAvailabilityPayload {
    startAt?: string;
    startTime?: string;
    endTime?: string;
}

export interface CreateAvailabilityResponse {
    success: boolean;
    message: string;
    data: {
        slot: AvailabilitySlot;
    };
}

export interface DeleteAvailabilityResponse {
    success: boolean;
    message: string;
}
