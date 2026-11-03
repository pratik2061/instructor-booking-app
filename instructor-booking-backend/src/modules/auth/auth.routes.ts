import { Router } from "express";

import AuthController from "./auth.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";

const router: Router = Router();

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.get(
    "/me",
    authMiddleware,
    AuthController.getMe
);

export default router;