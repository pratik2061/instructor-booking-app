import { useQuery } from "@tanstack/react-query";

import { authService } from "./auth.service";
import { useAuth } from "./auth.context";

export const authKeys = {
    all: ["auth"] as const,
    currentUser: () => [...authKeys.all, "me"] as const,
};

export function useCurrentUser() {
    const { accessToken } = useAuth();

    return useQuery({
        queryKey: authKeys.currentUser(),
        queryFn: authService.getCurrentUser,
        enabled: Boolean(accessToken),
        retry: false,
    });
}