import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/environment.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import instructorRoutes from "./modules/instructors/instructor.route.js";
import availabilityRoutes from "./modules/availability/availability.routes.js";
import bookingRoutes from "./modules/bookings/booking.routes.js";
import PaymentController from "./modules/payments/payment.controller.js";
import paymentRoutes from "./modules/payments/payment.routes.js";

const app: Express = express();

app.use(helmet());

app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true,
    })
);

// Stripe webhook must receive the raw body buffer BEFORE express.json() parses it
app.post(
    "/api/v1/payments/webhook",
    express.raw({ type: "application/json" }),
    PaymentController.handleWebhook,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100,
    })
);

// Health check
app.get("/api/v1/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Instructor Booking API is running",
    });
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/instructors", instructorRoutes);
app.use("/api/v1/availability", availabilityRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/payments", paymentRoutes);

// 404 handler
app.use(notFoundMiddleware);

// Global error handler
app.use(errorMiddleware);

export default app;