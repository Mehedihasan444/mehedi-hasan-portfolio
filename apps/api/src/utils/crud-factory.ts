import { Router, type Response, type NextFunction } from "express";
import { z } from "zod";
import { authenticate, requireAdmin, type AuthRequest } from "../middleware/auth";

/* eslint-disable @typescript-eslint/no-explicit-any */
type PrismaDelegate = {
  findMany: (args?: any) => Promise<any>;
  findUnique: (args: any) => Promise<any>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
  count: (args?: any) => Promise<number>;
};

const IMMUTABLE_FIELDS = new Set(["id", "createdAt", "updatedAt"]);

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

function sanitizeBody(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== "object" || Array.isArray(body)) return {};
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body as Record<string, unknown>)) {
    if (IMMUTABLE_FIELDS.has(k)) continue;
    out[k] = v;
  }
  return out;
}

export function createCrudRoutes(
  model: PrismaDelegate,
  options?: { publicFields?: string[]; publicRead?: boolean },
): Router {
  const router: Router = Router();
  const publicRead = options?.publicRead ?? false;

  const readMw = publicRead ? [] : [authenticate];

  router.get("/", ...readMw, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = paginationSchema.safeParse(req.query);
      const page = parsed.success ? parsed.data.page : 1;
      const limit = parsed.success ? parsed.data.limit : 50;
      const items = (await model.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      })) as unknown[];
      res.json({ status: "success", data: items, page, limit });
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", ...readMw, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id || "").slice(0, 100);
      if (!id) {
        res.status(400).json({ status: "error", message: "Invalid id" });
        return;
      }
      const item = await model.findUnique({ where: { id } });
      if (!item) {
        res.status(404).json({ status: "error", message: "Not found" });
        return;
      }
      res.json({ status: "success", data: item });
    } catch (error) {
      next(error);
    }
  });

  router.post(
    "/",
    authenticate,
    requireAdmin,
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const data = sanitizeBody(req.body);
        const item = await model.create({ data });
        res.status(201).json({ status: "success", data: item });
      } catch (error) {
        next(error);
      }
    },
  );

  router.put(
    "/:id",
    authenticate,
    requireAdmin,
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const id = String(req.params.id || "").slice(0, 100);
        if (!id) {
          res.status(400).json({ status: "error", message: "Invalid id" });
          return;
        }
        const data = sanitizeBody(req.body);
        const item = await model.update({ where: { id }, data });
        res.json({ status: "success", data: item });
      } catch (error) {
        next(error);
      }
    },
  );

  router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const id = String(req.params.id || "").slice(0, 100);
        if (!id) {
          res.status(400).json({ status: "error", message: "Invalid id" });
          return;
        }
        await model.delete({ where: { id } });
        res.json({ status: "success", message: "Deleted" });
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
