import { Router, type Response, type NextFunction } from "express";
import type { PrismaClient } from "@prisma/client";
import { authenticate, type AuthRequest } from "../middleware/auth";

type PrismaDelegate = {
  findMany: (args?: any) => any;
  findUnique: (args: any) => any;
  create: (args: any) => any;
  update: (args: any) => any;
  delete: (args: any) => any;
  count: (args?: any) => any;
};

export function createCrudRoutes(
  model: PrismaDelegate,
  options?: { publicFields?: string[] },
): Router {
  const router: Router = Router();

  router.get("/", async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const items = await model.findMany({ orderBy: { createdAt: "desc" } });
      res.json({ status: "success", data: items });
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const item = await model.findUnique({ where: { id: req.params.id } });
      if (!item) {
        return res.status(404).json({ status: "error", message: "Not found" });
      }
      res.json({ status: "success", data: item });
    } catch (error) {
      next(error);
    }
  });

  router.post("/", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const item = await model.create({ data: req.body });
      res.status(201).json({ status: "success", data: item });
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const item = await model.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ status: "success", data: item });
    } catch (error) {
      next(error);
    }
  });

  router.delete(
    "/:id",
    authenticate,
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        await model.delete({ where: { id: req.params.id } });
        res.json({ status: "success", message: "Deleted" });
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
