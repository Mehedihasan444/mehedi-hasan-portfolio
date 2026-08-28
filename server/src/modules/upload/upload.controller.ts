import { type Response, type NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth";
import { uploadToCloudinary, deleteFromCloudinary } from "./upload.service";
import { AppError } from "../../middleware/error-handler";
import { logger } from "../../config/logger";

export async function uploadImage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return next(new AppError("No file provided", 400));
    }

    const folder = (req.body.folder as string) || "portfolio";
    const publicId = req.body.publicId as string | undefined;

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
    if (!req.files || !(req.files as Express.Multer.File[]).length) {
      return next(new AppError("No files provided", 400));
    }

    const files = req.files as Express.Multer.File[];
    const folder = (req.body.folder as string) || "portfolio";

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
    const publicId = req.body.publicId as string;
    if (!publicId) {
      return next(new AppError("publicId is required", 400));
    }

    await deleteFromCloudinary(publicId);
    res.json({ status: "success", message: "Image deleted" });
  } catch (error) {
    next(error);
  }
}
