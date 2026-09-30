import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

function mapKnownError(err: unknown): AppError | null {
  const e = err as {
    code?: string;
    type?: string;
    name?: string;
    message?: string;
  };
  if (!e || typeof e !== "object") return null;

  if (e.code === "P2002") return new AppError("Resource already exists", 409);
  if (e.code === "P2025") return new AppError("Resource not found", 404);
  if (e.code === "LIMIT_FILE_SIZE") return new AppError("File too large", 413);
  if (e.code === "LIMIT_FILE_COUNT" || e.code === "LIMIT_UNEXPECTED_FILE")
    return new AppError("Too many files or unexpected field", 400);
  if (e.type === "entity.parse.failed" || e instanceof SyntaxError)
    return new AppError("Invalid JSON body", 400);
  if (e.name === "JsonWebTokenError" || e.name === "TokenExpiredError")
    return new AppError("Invalid or expired token", 401);
  return null;
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const mapped = mapKnownError(err);
  const finalErr = mapped ?? err;

  if (finalErr instanceof AppError) {
    logger.warn(
      { statusCode: finalErr.statusCode, message: finalErr.message },
      "Operational error",
    );
    return res.status(finalErr.statusCode).json({
      status: "error",
      message: finalErr.message,
    });
  }

  logger.error({ err }, "Unexpected error");
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
