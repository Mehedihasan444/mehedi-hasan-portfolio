import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authController } from "./auth.controller";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/auth";
import { loginSchema, createUserSchema } from "./auth.validation";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "error", message: "Too many auth attempts, try again later." },
});

router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/register", authLimiter, validate(createUserSchema), authController.register);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.me);

export default router;
