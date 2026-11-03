import type { RequestHandler } from "express";

import paymentService from "./payment.service.js";
import { createCheckoutSchema } from "./payment.validation.js";
import stripe from "../../config/stripe.js";
import { env } from "../../config/environment.js";

import ApiError from "../../utils/ApiError.js";

class PaymentController {
    createCheckoutSession: RequestHandler = async (req, res, next) => {
        try {
            const parsed = createCheckoutSchema.safeParse({
                body: req.body,
            });

            if (!parsed.success) {
                throw new ApiError(
                    400,
                    "Invalid request data.",
                );
            }

            const result = await paymentService.createCheckoutSession(
                req.user!.userId,
                parsed.data.body,
            );

            res.status(201).json({
                success: true,
                message: "Checkout session created successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    verifyCheckoutSession: RequestHandler = async (req, res, next) => {
        try {
            const sessionId = req.params.sessionId as string;
            const result = await paymentService.verifySession(
                sessionId,
                req.user!.userId,
            );

            res.status(200).json({
                success: true,
                message: "Session verified successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    handleWebhook: RequestHandler = async (req, res) => {
        const signature = req.headers["stripe-signature"];

        if (!signature || typeof signature !== "string") {
            res.status(400).json({
                success: false,
                message: "Missing Stripe signature.",
            });
            return;
        }

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body as Buffer,
                signature,
                env.STRIPE_WEBHOOK_SECRET,
            );
        } catch {
            res.status(400).json({
                success: false,
                message: "Invalid Stripe webhook signature.",
            });
            return;
        }

        try {
            switch (event.type) {
                case "checkout.session.completed": {
                    await paymentService.handleCheckoutCompleted(
                        event.data.object,
                    );
                    break;
                }

                case "checkout.session.expired": {
                    await paymentService.handleCheckoutExpired(
                        event.data.object,
                    );
                    break;
                }

                default:
                    // Ignore events that this application does not handle.
                    break;
            }

            res.status(200).json({
                received: true,
            });
        } catch {
            // A non-2xx response tells Stripe to retry the event.
            res.status(500).json({
                success: false,
                message: "Webhook processing failed.",
            });
        }
    };
}

export default new PaymentController();