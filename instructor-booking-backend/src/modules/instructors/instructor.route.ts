import { Router } from "express";

import InstructorController from "./instructor.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";

import authorizeRoles from "../../middlewares/role.middleware.js";

import { UserRole } from "../users/user.types.js";

const router: Router = Router();

// Public routes
router.get("/", InstructorController.getInstructors);

router.get("/profile", authMiddleware, authorizeRoles(UserRole.INSTRUCTOR), InstructorController.getMyProfile);

router.get("/:id", InstructorController.getInstructorById);

// Protected instructor routes
router.post(
    "/profile",
    authMiddleware,
    authorizeRoles(UserRole.INSTRUCTOR),
    InstructorController.createProfile
);

router.patch(
    "/profile",
    authMiddleware,
    authorizeRoles(UserRole.INSTRUCTOR),
    InstructorController.updateProfile
);

export default router;