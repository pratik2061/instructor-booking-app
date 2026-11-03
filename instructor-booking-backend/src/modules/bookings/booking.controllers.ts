import type { RequestHandler } from "express";

import BookingService from "./booking.service.js";

import {
    createBookingSchema,
    bookingQuerySchema,
} from "./booking.validation.js";

import ApiError from "../../utils/ApiError.js";

class BookingController {
    // Student creates a booking.
    createBooking: RequestHandler = async (req, res, next) => {
        try {
            if (!req.user) {
                throw new ApiError(401, "Authentication required");
            }

            const input = createBookingSchema.parse(req.body);

            const booking = await BookingService.createBooking(
                req.user.userId,
                input.availabilityId
            );

            res.status(201).json({
                success: true,
                message: "Consultation booked successfully",
                data: booking,
            });
        } catch (error) {
            next(error);
        }
    };

    // Student views their booking history.
    getMyBookings: RequestHandler = async (req, res, next) => {
        try {
            if (!req.user) {
                throw new ApiError(401, "Authentication required");
            }

            const query = bookingQuerySchema.parse(req.query);

            const result = await BookingService.getMyBookings(
                req.user.userId,
                query
            );

            res.status(200).json({
                success: true,
                message: "Your bookings retrieved successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    // Student cancels their own booking.
    cancelBooking: RequestHandler = async (req, res, next) => {
        try {
            if (!req.user) {
                throw new ApiError(401, "Authentication required");
            }

            const booking = await BookingService.cancelBooking(
                req.user.userId,
                String(req.params.id)
            );

            res.status(200).json({
                success: true,
                message: "Booking cancelled successfully",
                data: booking,
            });
        } catch (error) {
            next(error);
        }
    };
    // Instructor views consultations booked with them.
    getInstructorBookings: RequestHandler = async (req, res, next) => {
        try {
            if (!req.user) {
                throw new ApiError(401, "Authentication required");
            }

            const query = bookingQuerySchema.parse(req.query);

            const result = await BookingService.getInstructorBookings(
                req.user.userId,
                query
            );

            res.status(200).json({
                success: true,
                message: "Instructor bookings retrieved successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new BookingController();