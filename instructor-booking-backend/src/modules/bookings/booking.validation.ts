import { z } from "zod";

export const createBookingSchema = z.object({
    availabilityId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid availability ID"),
});

export const bookingQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(50).default(10),

    status: z
        .enum([
            "pending_payment",
            "confirmed",
            "cancelled",
            "completed",
        ])
        .optional(),
});

export type CreateBookingInput = z.infer<
    typeof createBookingSchema
>;

export type BookingQuery = z.infer<
    typeof bookingQuerySchema
>;