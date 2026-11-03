import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "accessToken";

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const queryClient = useQueryClient();

    const [accessToken, setToken] = useState<string | null>(() => {
        return localStorage.getItem(TOKEN_KEY);
    });

    const setAccessToken = (token: string) => {
        localStorage.setItem(TOKEN_KEY, token);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        queryClient.clear();
    };

    return (
        <AuthContext.Provider
            value={{ accessToken, setAccessToken, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}