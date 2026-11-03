import api from "../../lib/axios";

import type {
    AuthResponse,
    LoginCredentials,
    RegisterCredentials,
    CurrentUserResponse,
} from "./auth.types";

const AUTH_ENDPOINT = "/auth";

export const authService = {
    register: async (payload: RegisterCredentials) => {
        const response = await api.post<AuthResponse>(
            `${AUTH_ENDPOINT}/register`,
            payload,
        );

        return response.data;
    },

    login: async (payload: LoginCredentials) => {
        const response = await api.post<AuthResponse>(
            `${AUTH_ENDPOINT}/login`,
            payload,
        );

        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get<CurrentUserResponse>(
            `${AUTH_ENDPOINT}/me`,
        );

        return response.data.data.user;
    },
};