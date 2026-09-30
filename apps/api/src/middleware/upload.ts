import multer from "multer";
import type { Request } from "express";
import { AppError } from "./error-handler";

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
  const extOk = /\.(jpe?g|png|webp|gif|avif)$/i.test(file.originalname || "");
  if (allowed.includes(file.mimetype) && extOk) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Only image files (JPEG, PNG, WebP, GIF, AVIF) are allowed",
        400,
      ) as unknown as Error,
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
    fields: 10,
    parts: 25,
  },
});
