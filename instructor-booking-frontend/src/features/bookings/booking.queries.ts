import { useQuery } from "@tanstack/react-query";
import { bookingService } from "./booking.service";
import type { BookingQueryParams } from "./booking.service";

export const bookingKeys = {
    all: ["bookings"] as const,

    lists: () => [...bookingKeys.all, "list"] as const,

    list: (params: BookingQueryParams) =>
        [...bookingKeys.lists(), params] as const,
};

export function useMyBookings(params: BookingQueryParams = {}) {
    return useQuery({
        queryKey: bookingKeys.list(params),
        queryFn: () => bookingService.getMyBookings(params),
    });
}

export const instructorBookingKeys = {
    all: ["instructor-bookings"] as const,
    list: (params: BookingQueryParams) =>
        [...instructorBookingKeys.all, params] as const,
};

export function useInstructorBookings(
    params: BookingQueryParams = {}
) {
    return useQuery({
        queryKey: instructorBookingKeys.list(params),
        queryFn: () => bookingService.getInstructorBookings(params),
    });
}