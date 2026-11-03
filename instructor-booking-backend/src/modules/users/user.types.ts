export enum UserRole {
    STUDENT = "student",
    INSTRUCTOR = "instructor",
}

export interface IUser {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    isVerified: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}