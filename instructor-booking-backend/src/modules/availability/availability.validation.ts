import { z } from "zod";

export const createAvailabilitySchema = z
    .object({
        startAt: z.string().optional(),
        startTime: z.string().optional(),
    })
    .refine((data) => data.startAt || data.startTime, {
        message: "Start time is required",
        path: ["startAt"],
    })
    .transform((data) => {
        const raw = (data.startAt || data.startTime)!;
        const date = new Date(raw);
        if (isNaN(date.getTime())) {
            throw new Error("Invalid start time date");
        }
        return {
            startAt: date.toISOString(),
        };
    });

export const availabilityQuerySchema = z
    .object({
        page: z.coerce.number().int().min(1).default(1),

        limit: z.coerce.number().int().min(1).max(50).default(20),

        from: z.iso.datetime({ offset: true }).optional(),

        to: z.iso.datetime({ offset: true }).optional(),
    })
    .refine(
        (data) =>
            !data.from ||
            !data.to ||
            new Date(data.from) < new Date(data.to),
        {
            message: "'from' must be earlier than 'to'",
            path: ["to"],
        }
    );

export type CreateAvailabilityInput = z.infer<
    typeof createAvailabilitySchema
>;

export type AvailabilityQuery = z.infer<
    typeof availabilityQuerySchema
>;