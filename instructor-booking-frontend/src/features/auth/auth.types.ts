export type UserRole = "student" | "instructor";

export interface User {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    isVerified: boolean;
    isActive: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        accessToken: string;
    };
}

export interface CurrentUserResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
    };
}