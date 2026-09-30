import type { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth";
import { authService } from "./auth.service";
import { env } from "../../config/env";

const COOKIE_NAME = "token";
const isProd = env.NODE_ENV === "production";

function setAuthCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      setAuthCookie(res, result.token);
      res.json({ status: "success", data: result });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      setAuthCookie(res, result.token);
      res.status(201).json({ status: "success", data: result });
    } catch (error) {
      next(error);
    }
  }

  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        res.status(401).json({ status: "error", message: "Authentication required" });
        return;
      }
      const user = await authService.getMe(req.userId);
      res.json({ status: "success", data: user });
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response) {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
    });
    res.json({ status: "success", message: "Logged out" });
  }
}

export const authController = new AuthController();
