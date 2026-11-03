import { z } from "zod";

import { Currency } from "./instructor.types.js";

export const createInstructorSchema = z.object({
    bio: z
        .string()
        .trim()
        .min(20, "Bio must contain at least 20 characters")
        .max(1000),

    expertise: z
        .array(z.string().trim().min(2))
        .min(1, "At least one expertise area is required")
        .max(10),

    consultationFee: z
        .number()
        .int()
        .positive("Consultation fee must be positive")
        .max(Number.MAX_SAFE_INTEGER),

    currency: z
        .enum(Currency)
        .default(Currency.NPR),
});

export const updateInstructorSchema =
    createInstructorSchema.partial();

export const instructorQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(50).default(10),

    expertise: z.string().trim().optional(),
});

export type CreateInstructorInput =
    z.infer<typeof createInstructorSchema>;

export type UpdateInstructorInput =
    z.infer<typeof updateInstructorSchema>;

export type InstructorQuery =
    z.infer<typeof instructorQuerySchema>;