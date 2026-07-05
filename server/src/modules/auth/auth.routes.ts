import { Router } from "express";
import { authController } from "./auth.controller";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/auth";
import { loginSchema, createUserSchema } from "./auth.validation";

const router = Router();

router.post("/login", validate(loginSchema), authController.login);
router.post("/register", validate(createUserSchema), authController.register);
router.get("/me", authenticate, authController.me);

export default router;
