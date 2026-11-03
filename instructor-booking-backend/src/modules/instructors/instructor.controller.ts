import type {
    Request,
    Response,
    NextFunction,
} from "express";

import InstructorService from "./instructor.service.js";

import {
    createInstructorSchema,
    updateInstructorSchema,
    instructorQuerySchema,
} from "./instructor.validation.js";

import ApiError from "../../utils/ApiError.js";

class InstructorController {

    // Create profile
    createProfile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (!req.user) {
                throw new ApiError(401, "Authentication required");
            }

            const validatedData = createInstructorSchema.parse(
                req.body
            );

            const profile = await InstructorService.createProfile(
                req.user.userId,
                validatedData
            );

            res.status(201).json({
                success: true,
                message: "Instructor profile created successfully",
                data: { profile },
            });
        } catch (error) {
            next(error);
        }
    };

    // Update profile
    updateProfile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (!req.user) {
                throw new ApiError(401, "Authentication required");
            }

            const validatedData = updateInstructorSchema.parse(
                req.body
            );

            const profile = await InstructorService.updateProfile(
                req.user.userId,
                validatedData
            );

            res.status(200).json({
                success: true,
                message: "Instructor profile updated successfully",
                data: { profile },
            });
        } catch (error) {
            next(error);
        }
    };

    // Get own profile
    getMyProfile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (!req.user) {
                throw new ApiError(401, "Authentication required");
            }

            const profile = await InstructorService.getMyProfile(
                req.user.userId
            );

            res.status(200).json({
                success: true,
                message: "Instructor profile fetched successfully",
                data: { profile },
            });
        } catch (error) {
            next(error);
        }
    };

    // Get all approved instructors
    getInstructors = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const query = instructorQuerySchema.parse(req.query);

            const result = await InstructorService.getInstructors(
                query
            );

            res.status(200).json({
                success: true,
                message: "Instructors fetched successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    // Get instructor by ID
    getInstructorById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const profile = await InstructorService.getInstructorById(
                String(req.params.id)
            );

            res.status(200).json({
                success: true,
                message: "Instructor fetched successfully",
                data: { profile },
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new InstructorController();