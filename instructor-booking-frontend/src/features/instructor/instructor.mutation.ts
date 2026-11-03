import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instructorService } from "./instructor.service";
import { instructorKeys } from "./instructor.queries";
import type {
    CreateProfilePayload,
    UpdateProfilePayload,
} from "./instructor.types";

export function useCreateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateProfilePayload) =>
            instructorService.createProfile(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: instructorKeys.myProfile(),
            });
            queryClient.invalidateQueries({
                queryKey: instructorKeys.lists(),
            });
        },
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateProfilePayload) =>
            instructorService.updateProfile(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: instructorKeys.myProfile(),
            });
            queryClient.invalidateQueries({
                queryKey: instructorKeys.lists(),
            });
        },
    });
}

