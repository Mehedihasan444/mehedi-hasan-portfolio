import { Router, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../../config/database";
import { authenticate, requireAdmin, type AuthRequest } from "../../middleware/auth";

const guestbookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "error", message: "Too many entries, please try again later." },
});

const guestbookSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  message: z.string().trim().min(3, "Message must be at least 3 characters").max(280),
  website: z.string().max(0).optional().or(z.literal("")),
});

const approvalSchema = z.object({
  approved: z.boolean(),
});

const router = Router();

// Public wall — approved entries only, newest first.
router.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = Math.min(Math.max(Number(req.query.page) || 1, 1), 1000);
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
    const entries = await prisma.guestbookEntry.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });
    res.json({ status: "success", data: entries, page, limit });
  } catch (error) {
    next(error);
  }
});

// Public sign — new entries land unapproved for admin moderation.
router.post("/", guestbookLimiter, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = guestbookSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: "error",
        message: parsed.error.issues[0]?.message || "Invalid input",
        issues: parsed.error.flatten().fieldErrors,
      });
    }
    const { name, message, website } = parsed.data;
    if (website && website.length > 0) {
      return res.status(201).json({ status: "success", message: "Thanks for signing!" });
    }

    const entry = await prisma.guestbookEntry.create({
      data: { name, message },
    });

    res.status(201).json({
      status: "success",
      message: "Thanks for signing!",
      data: entry,
    });
  } catch (error) {
    next(error);
  }
});

// Admin moderation queue — everything, including pending entries.
router.get(
  "/all",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const page = Math.min(Math.max(Number(req.query.page) || 1, 1), 1000);
      const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
      const entries = await prisma.guestbookEntry.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      });
      res.json({ status: "success", data: entries, page, limit });
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
      const parsed = approvalSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ status: "error", message: "approved must be a boolean" });
      }
      const entry = await prisma.guestbookEntry.update({
        where: { id },
        data: { approved: parsed.data.approved },
      });
      res.json({ status: "success", data: entry });
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
      await prisma.guestbookEntry.delete({ where: { id } });
      res.json({ status: "success", message: "Deleted" });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
