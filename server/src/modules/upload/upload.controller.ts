import { type Response, type NextFunction } from "express";
import { z } from "zod";
import type { AuthRequest } from "../../middleware/auth";
import { uploadToCloudinary, deleteFromCloudinary } from "./upload.service";
import { AppError } from "../../middleware/error-handler";
import { logger } from "../../config/logger";

const folderSchema = z
  .string()
  .trim()
  .min(1)
  .max(60)
  .regex(/^[a-zA-Z0-9/_-]+$/, "Invalid folder");
const publicIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(200)
  .regex(/^[a-zA-Z0-9/_-]+$/, "Invalid publicId");

function sanitizeFolder(input: unknown): string {
  const parsed = folderSchema.safeParse(input);
  if (!parsed.success) return "portfolio";
  const v = parsed.data.replace(/^\/+|\/+$/g, "");
  if (!v.startsWith("portfolio")) return "portfolio";
  return v;
}

export async function uploadImage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return next(new AppError("No file provided", 400));
    }

    const folder = sanitizeFolder(req.body?.folder);
    let publicId: string | undefined;
    if (req.body?.publicId !== undefined) {
      const parsed = publicIdSchema.safeParse(req.body.publicId);
      if (!parsed.success) return next(new AppError("Invalid publicId", 400));
      if (!parsed.data.startsWith("portfolio/"))
        return next(new AppError("publicId must be inside portfolio/", 400));
      publicId = parsed.data;
    }

    logger.info({ folder, size: req.file.size, mimetype: req.file.mimetype }, "Uploading image");

    const result = await uploadToCloudinary(req.file.buffer, folder, publicId);

    res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadMultipleImages(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || !files.length) {
      return next(new AppError("No files provided", 400));
    }

    const totalBytes = files.reduce((n, f) => n + (f.size || 0), 0);
    if (totalBytes > 20 * 1024 * 1024) {
      return next(new AppError("Combined files too large (max 20MB)", 413));
    }

    const folder = sanitizeFolder(req.body?.folder);

    const results = await Promise.all(files.map((file) => uploadToCloudinary(file.buffer, folder)));

    res.status(201).json({
      status: "success",
      data: results,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteImage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const parsed = publicIdSchema.safeParse(req.body?.publicId);
    if (!parsed.success) {
      return next(new AppError("publicId is required", 400));
    }
    if (!parsed.data.startsWith("portfolio/")) {
      return next(new AppError("Can only delete portfolio/ images", 403));
    }

    await deleteFromCloudinary(parsed.data);
    res.json({ status: "success", message: "Image deleted" });
  } catch (error) {
    next(error);
  }
}
