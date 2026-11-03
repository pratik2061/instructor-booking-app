import { z } from "zod";

export const createCheckoutSchema = z.object({
    body: z.object({
        availabilityId: z.string().regex(
            /^[0-9a-fA-F]{24}$/,
            "Invalid availability ID",
        ),
    }),
});

export type CreateCheckoutInput = z.infer<
    typeof createCheckoutSchema
>["body"];