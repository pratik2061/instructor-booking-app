import type { RequestHandler } from "express";

import { UserRole } from "../modules/users/user.types.js";
import ApiError from "../utils/ApiError.js";

const authorizeRoles = (
    ...allowedRoles: UserRole[]
): RequestHandler => {
    return (req, _res, next) => {
        if (!req.user) {
            next(new ApiError(401, "Authentication required"));
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            next(
                new ApiError(
                    403,
                    "You are not authorized to access this resource"
                )
            );
            return;
        }

        next();
    };
};

export default authorizeRoles;