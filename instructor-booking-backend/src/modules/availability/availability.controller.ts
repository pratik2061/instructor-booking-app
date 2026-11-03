import type { RequestHandler } from "express";

import AvailabilityService from "./availability.service.js";

import {
    createAvailabilitySchema,
    availabilityQuerySchema,
} from "./availability.validation.js";

import ApiError from "../../utils/ApiError.js";

class AvailabilityController {
    createSlot: RequestHandler = async (req, res, next) => {
        try {
            if (!req.user) {
                throw new ApiError(401, "Authentication required");
            }

            const input = createAvailabilitySchema.parse(req.body);

            const slot = await AvailabilityService.createSlot(
                req.user.userId,
                input
            );

            res.status(201).json({
                success: true,
                message: "Availability slot created successfully",
                data: slot,
            });
        } catch (error) {
            next(error);
        }
    };

    getMySlots: RequestHandler = async (req, res, next) => {
        try {
            if (!req.user) {
                throw new ApiError(401, "Authentication required");
            }

            const query = availabilityQuerySchema.parse(req.query);

            const result = await AvailabilityService.getMySlots(
                req.user.userId,
                query
            );

            res.status(200).json({
                success: true,
                message: "Your availability slots retrieved successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getInstructorSlots: RequestHandler = async (req, res, next) => {
        try {
            const query = availabilityQuerySchema.parse(req.query);

            const result = await AvailabilityService.getInstructorSlots(
                String(req.params.instructorId),
                query
            );

            res.status(200).json({
                success: true,
                message: "Available slots retrieved successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteSlot: RequestHandler = async (req, res, next) => {
        try {
            if (!req.user) {
                throw new ApiError(401, "Authentication required");
            }

            const slot = await AvailabilityService.deleteSlot(
                req.user.userId,
                String(req.params.id)
            );

            res.status(200).json({
                success: true,
                message: "Availability slot deleted successfully",
                data: slot,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new AvailabilityController();