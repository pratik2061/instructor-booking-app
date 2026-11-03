import { Router } from "express";

import PaymentController from "./payment.controller.js";
import { UserRole } from "../users/user.types.js";
import authorizeRoles from "../../middlewares/role.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router: Router = Router();

router.post(
    "/checkout",
    authMiddleware,
    authorizeRoles(UserRole.STUDENT),
    PaymentController.createCheckoutSession,
);

router.get(
    "/verify/:sessionId",
    authMiddleware,
    authorizeRoles(UserRole.STUDENT),
    PaymentController.verifyCheckoutSession,
);

export default router;