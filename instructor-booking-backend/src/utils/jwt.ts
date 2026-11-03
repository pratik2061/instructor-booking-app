import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "../config/environment.js";
import { UserRole } from "../modules/users/user.types.js";

export interface JwtPayload {
    userId: string;
    role: UserRole;
}

export const generateAccessToken = (
    payload: JwtPayload
): string => {
    const options: SignOptions = {
        expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    };

    return jwt.sign(payload, env.JWT_SECRET, options);
};

export const verifyAccessToken = (
    token: string
): JwtPayload => {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};