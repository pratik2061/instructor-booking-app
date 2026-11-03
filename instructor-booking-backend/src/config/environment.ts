import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),

    PORT: z.coerce.number().default(5000),

    MONGODB_URI: z.string().min(1, "MongoDB URI is required"),

    JWT_SECRET: z.string().min(32, "JWT secret must be at least 32 characters"),

    JWT_EXPIRES_IN: z.string().default("1d"),

    CLIENT_URL: z.string().url().default("http://localhost:5173"),
    STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
    STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),

    PAYMENT_SUCCESS_URL: z.string().url(),
    PAYMENT_CANCEL_URL: z.string().url(),
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