
import api from "../../lib/axios";

import type {
    AvailabilityListResponse,
    CreateAvailabilityPayload,
    CreateAvailabilityResponse,
    DeleteAvailabilityResponse,
} from "./availability.types";

export const availabilityService = {
    // Get the logged-in instructor's availability slots
    getMyAvailability: async (page = 1, limit = 20) => {
        const response = await api.get<AvailabilityListResponse>(
            "/availability/me",
            {
                params: { page, limit },
            },
        );

        return response.data.data;
    },

    // Create a new availability slot
    createAvailability: async (payload: CreateAvailabilityPayload) => {
        const response = await api.post<CreateAvailabilityResponse>(
            "/availability",
            payload,
        );

        return response.data;
    },

    // Delete an existing availability slot
    deleteAvailability: async (slotId: string) => {
        const response = await api.delete<DeleteAvailabilityResponse>(
            `/availability/${slotId}`,
        );

        return response.data;
    },

    // Get availability slots of a particular instructor
    getInstructorAvailability: async (
        instructorId: string,
        page = 1,
        limit = 20,
    ) => {
        const response = await api.get<AvailabilityListResponse>(
            `/availability/instructors/${instructorId}`,
            {
                params: { page, limit },
            },
        );

        return response.data.data;
    },
};
