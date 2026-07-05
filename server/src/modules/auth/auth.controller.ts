import type { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth";
import { authService } from "./auth.service";

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.json({ status: "success", data: result });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({ status: "success", data: result });
    } catch (error) {
      next(error);
    }
  }

  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getMe(req.userId!);
      res.json({ status: "success", data: user });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
