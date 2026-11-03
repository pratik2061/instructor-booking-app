import type {
    Request,
    Response,
    NextFunction,
} from "express";


import {
    registerSchema,
    loginSchema,
} from "./auth.validation.js";

import AuthService from "./auth.service.js"
import ApiError from "../../utils/ApiError.js";

class AuthController {

    register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const validatedData = registerSchema.parse(req.body);

            const result = await AuthService.register(validatedData);

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const validatedData = loginSchema.parse(req.body);

            const result = await AuthService.login(validatedData);

            res.status(200).json({
                success: true,
                message: "Login successful",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getMe = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (!req.user) {
                throw new ApiError(401, "Authentication required");
            }

            const user = await AuthService.getCurrentUser(
                req.user.userId
            );

            res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: {
                    user,
                },
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new AuthController();