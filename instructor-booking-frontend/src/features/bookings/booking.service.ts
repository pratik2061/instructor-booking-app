import api from "../../lib/axios";
import type { BookingListResponse, BookingStatus } from "./booking.types";

export interface BookingQueryParams {
    page?: number;
    limit?: number;
    status?: BookingStatus;
}

export const bookingService = {
    getMyBookings: async (params: BookingQueryParams = {}) => {
        const response = await api.get<BookingListResponse>(
            "/bookings/me",
            { params },
        );

        return response.data.data;
    },
    getInstructorBookings: async (params: BookingQueryParams = {}) => {
        const response = await api.get<BookingListResponse>(
            "/bookings/instructor/me",
            { params }
        );

        return response.data.data;
    },
};