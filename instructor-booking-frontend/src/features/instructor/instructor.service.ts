import api from "../../lib/axios";

import type {
    Instructor,
    InstructorListResponse,
    InstructorResponse,
    CreateProfilePayload,
    UpdateProfilePayload,
} from "./instructor.types";

export const instructorService = {
    getInstructors: async (page = 1, limit = 10) => {
        const response = await api.get<InstructorListResponse>(
            "/instructors",
            {
                params: {
                    page,
                    limit,
                },
            },
        );

        return response.data.data;
    },

    getInstructorById: async (instructorId: string): Promise<Instructor> => {
        const response = await api.get<InstructorResponse>(
            `/instructors/${instructorId}`
        );

        return response.data.data.profile;
    },

    getMyProfile: async (): Promise<Instructor> => {
        const response = await api.get<InstructorResponse>(
            "/instructors/profile"
        );

        return response.data.data.profile;
    },

    createProfile: async (payload: CreateProfilePayload): Promise<Instructor> => {
        const response = await api.post<InstructorResponse>(
            "/instructors/profile",
            payload
        );

        return response.data.data.profile;
    },

    updateProfile: async (payload: UpdateProfilePayload): Promise<Instructor> => {
        const response = await api.patch<InstructorResponse>(
            "/instructors/profile",
            payload
        );

        return response.data.data.profile;
    },
};
