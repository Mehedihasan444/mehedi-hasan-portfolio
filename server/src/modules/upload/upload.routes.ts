import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate, requireAdmin } from "../../middleware/auth";
import { upload } from "../../middleware/upload";
import { uploadImage, uploadMultipleImages, deleteImage } from "./upload.controller";

const router = Router();

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "error", message: "Too many uploads, try again later." },
});

router.post("/", authenticate, requireAdmin, uploadLimiter, upload.single("image"), uploadImage);
router.post(
  "/multiple",
  authenticate,
  requireAdmin,
  uploadLimiter,
  upload.array("images", 10),
  uploadMultipleImages,
);
router.delete("/", authenticate, requireAdmin, deleteImage);

export default router;
