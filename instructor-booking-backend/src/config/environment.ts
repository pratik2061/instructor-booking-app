import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z
    .object({
        NODE_ENV: z
            .enum(["development", "production", "test"])
            .default("development"),

        PORT: z.coerce.number().default(5000),

        MONGODB_URI: z.string().trim().min(1, "MongoDB URI is required"),

        JWT_SECRET: z.string().trim().min(32, "JWT secret must be at least 32 characters"),

        JWT_EXPIRES_IN: z.string().trim().default("1d"),

        CLIENT_URL: z.string().trim().url().default("http://localhost:5173"),
        STRIPE_SECRET_KEY: z.string().trim().startsWith("sk_"),
        STRIPE_WEBHOOK_SECRET: z.string().trim().startsWith("whsec_"),

        PAYMENT_SUCCESS_URL: z.string().trim().url().optional(),
        PAYMENT_CANCEL_URL: z.string().trim().url().optional(),
    })
    .transform((data) => {
        // Strip trailing slash from client url if present
        const clientUrl = data.CLIENT_URL.replace(/\/+$/, "");
        return {
            ...data,
            CLIENT_URL: clientUrl,
            PAYMENT_SUCCESS_URL:
                data.PAYMENT_SUCCESS_URL || `${clientUrl}/payment/success`,
            PAYMENT_CANCEL_URL:
                data.PAYMENT_CANCEL_URL || `${clientUrl}/payment/cancel`,
        };
    });

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error(
        "Invalid environment variables:",
        z.treeifyError(parsedEnv.error)
    );

    process.exit(1);
}

export const env = parsedEnv.data;