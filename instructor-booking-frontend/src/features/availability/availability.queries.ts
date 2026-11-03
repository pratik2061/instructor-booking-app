
import { useQuery } from "@tanstack/react-query";
import { availabilityService } from "./availability.service";

export const availabilityKeys = {
    all: ["availability"] as const,

    lists: () => [...availabilityKeys.all, "list"] as const,

    myAvailability: (page: number, limit: number) =>
        [...availabilityKeys.lists(), "me", { page, limit }] as const,

    instructorAvailability: (
        instructorId: string,
        page: number,
        limit: number,
    ) =>
        [
            ...availabilityKeys.lists(),
            "instructor",
            instructorId,
            { page, limit },
        ] as const,
};

export function useMyAvailability(page = 1, limit = 20) {
    return useQuery({
        queryKey: availabilityKeys.myAvailability(page, limit),
        queryFn: () => availabilityService.getMyAvailability(page, limit),
    });
}

export function useInstructorAvailability(
    instructorId: string,
    page = 1,
    limit = 20,
) {
    return useQuery({
        queryKey: availabilityKeys.instructorAvailability(
            instructorId,
            page,
            limit,
        ),
        queryFn: () =>
            availabilityService.getInstructorAvailability(
                instructorId,
                page,
                limit,
            ),
        enabled: Boolean(instructorId),
    });
}
