import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./error-handler";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return next(new AppError("Authentication required", 401));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }
};
