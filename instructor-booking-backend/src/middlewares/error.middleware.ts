import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import ApiError from "../utils/ApiError.js";
import { env } from "../config/environment.js";

const errorMiddleware: ErrorRequestHandler = (
    error,
    _req,
    res,
    _next
) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    let errors: unknown[] = [];

    if (error instanceof ApiError) {
        statusCode = error.statusCode;
        message = error.message;
        errors = error.errors;
    } else if (error instanceof ZodError) {
        statusCode = 400;
        message = "Validation failed";

        errors = error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
        }));
    } else if (error?.code === 11000) {
        statusCode = 409;
        message = "Resource already exists";
    }

    if (env.NODE_ENV !== "production") {
        console.error(error);
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors,
        ...(env.NODE_ENV === "development" && {
            stack: error.stack,
        }),
    });
};

export default errorMiddleware;