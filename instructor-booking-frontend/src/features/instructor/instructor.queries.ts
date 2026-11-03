import { useQuery } from "@tanstack/react-query";

import { instructorService } from "./instructor.service";

export const instructorKeys = {
    all: ["instructors"] as const,

    lists: () => [...instructorKeys.all, "list"] as const,

    list: (page: number, limit: number) =>
        [...instructorKeys.lists(), { page, limit }] as const,

    details: () => [...instructorKeys.all, "detail"] as const,

    detail: (id: string) =>
        [...instructorKeys.details(), id] as const,

    myProfile: () => [...instructorKeys.all, "myProfile"] as const,
};

export function useMyProfile() {
    return useQuery({
        queryKey: instructorKeys.myProfile(),
        queryFn: instructorService.getMyProfile,
        retry: false,
    });
}
export function useInstructors(page = 1, limit = 10) {
    return useQuery({
        queryKey: instructorKeys.list(page, limit),
        queryFn: () => instructorService.getInstructors(page, limit),
    });
}

export function useInstructor(instructorId: string) {
    return useQuery({
        queryKey: instructorKeys.detail(instructorId),
        queryFn: () =>
            instructorService.getInstructorById(instructorId),
        enabled: Boolean(instructorId),
    });
}