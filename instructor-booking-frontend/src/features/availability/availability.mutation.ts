
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { availabilityService } from "./availability.service";
import { availabilityKeys } from "./availability.queries";

import type { CreateAvailabilityPayload } from "./availability.types";

export function useCreateAvailability() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateAvailabilityPayload) =>
            availabilityService.createAvailability(payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: availabilityKeys.lists(),
            });
        },
    });
}

export function useDeleteAvailability() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (slotId: string) =>
            availabilityService.deleteAvailability(slotId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: availabilityKeys.lists(),
            });
        },
    });
}
