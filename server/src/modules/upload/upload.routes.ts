import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { upload } from "../../middleware/upload";
import { uploadImage, uploadMultipleImages, deleteImage } from "./upload.controller";

const router = Router();

router.post("/", authenticate, upload.single("image"), uploadImage);
router.post("/multiple", authenticate, upload.array("images", 10), uploadMultipleImages);
router.delete("/", authenticate, deleteImage);

export default router;
