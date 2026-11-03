import { Router } from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";

import { UserRole } from "../users/user.types.js";
import bookingControllers from "./booking.controllers.js";

const router: Router = Router();

// All booking routes require authentication.
router.use(authMiddleware);

// Student routes.
router.post(
    "/",
    authorizeRoles(UserRole.STUDENT),
    bookingControllers.createBooking
);

router.get(
    "/me",
    authorizeRoles(UserRole.STUDENT),
    bookingControllers.getMyBookings
);

router.patch(
    "/:id/cancel",
    authorizeRoles(UserRole.STUDENT),
    bookingControllers.cancelBooking
);

// Instructor routes.
router.get(
    "/instructor/me",
    authorizeRoles(UserRole.INSTRUCTOR),
    bookingControllers.getInstructorBookings
);

export default router;