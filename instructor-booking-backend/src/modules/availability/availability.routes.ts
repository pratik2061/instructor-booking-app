import { Router } from "express";


import authMiddleware from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";

import { UserRole } from "../users/user.types.js";
import availabilityController from "./availability.controller.js";

const router: Router = Router();

// Instructor routes
router.post(
    "/",
    authMiddleware,
    authorizeRoles(UserRole.INSTRUCTOR),
    availabilityController.createSlot
);

router.get(
    "/me",
    authMiddleware,
    authorizeRoles(UserRole.INSTRUCTOR),
    availabilityController.getMySlots
);

router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles(UserRole.INSTRUCTOR),
    availabilityController.deleteSlot
);

// Public route: students can browse an instructor's available slots.
router.get(
    "/instructors/:instructorId",
    availabilityController.getInstructorSlots
);

export default router;