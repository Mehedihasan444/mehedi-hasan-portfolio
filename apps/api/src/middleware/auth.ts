import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./error-handler";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

type TokenPayload = {
  userId: string;
  role?: string;
};

function extractToken(req: Request): string | undefined {
  const cookieToken =
    (req as Request & { cookies?: Record<string, string> }).cookies?.token ?? undefined;
  if (typeof cookieToken === "string" && cookieToken.length > 0) return cookieToken;

  const header = req.headers.authorization;
  if (typeof header === "string" && header.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim() || undefined;
  }
  return undefined;
}

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const token = extractToken(req);

  if (!token) {
    return next(new AppError("Authentication required", 401));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
    }) as TokenPayload;
    if (!decoded || typeof decoded.userId !== "string" || decoded.userId.length === 0) {
      return next(new AppError("Invalid or expired token", 401));
    }
    req.userId = decoded.userId;
    if (typeof decoded.role === "string") req.userRole = decoded.role;
    next();
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }
};

export const requireAdmin = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (!req.userId) {
    return next(new AppError("Authentication required", 401));
  }
  if (req.userRole && req.userRole !== "admin") {
    return next(new AppError("Admin access required", 403));
  }
  next();
};
