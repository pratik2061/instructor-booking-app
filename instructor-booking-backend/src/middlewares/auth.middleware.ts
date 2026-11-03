import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";

const authMiddleware: RequestHandler = (
    req,
    _res,
    next
) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            throw new ApiError(401, "Authentication token required");
        }

        const token = authorization.split(" ")[1];

        if (!token) {
            throw new ApiError(401, "Invalid authentication token");
        }

        const decoded = verifyAccessToken(token);

        req.user = decoded;

        next();
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
            return;
        }

        if (
            error instanceof jwt.JsonWebTokenError ||
            error instanceof jwt.TokenExpiredError
        ) {
            next(new ApiError(401, "Invalid or expired authentication token"));
            return;
        }

        next(error);
    }
};

export default authMiddleware;