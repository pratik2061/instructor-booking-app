import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "./auth.service";
import { authKeys } from "./auth.queries";
import { useAuth } from "./auth.context";

import type {
    LoginCredentials,
    RegisterCredentials,
} from "./auth.types";

export function useLogin() {
    const { setAccessToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: LoginCredentials) =>
            authService.login(credentials),

        onSuccess: async (response) => {
            setAccessToken(response.data.accessToken);

            queryClient.setQueryData(
                authKeys.currentUser(),
                response.data.user,
            );
        },
    });
}

export function useRegister() {
    const { setAccessToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: RegisterCredentials) =>
            authService.register(credentials),

        onSuccess: async (response) => {
            setAccessToken(response.data.accessToken);

            queryClient.setQueryData(
                authKeys.currentUser(),
                response.data.user,
            );
        },
    });
}