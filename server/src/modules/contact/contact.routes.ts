import { Router, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../../config/database";
import { authenticate, requireAdmin, type AuthRequest } from "../../middleware/auth";

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "error", message: "Too many messages, please try again later." },
});

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email").max(254),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
  website: z.string().max(0).optional().or(z.literal("")),
});

const markReadSchema = z.object({
  read: z.boolean(),
});

const router = Router();

router.post("/", contactLimiter, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: "error",
        message: parsed.error.issues[0]?.message || "Invalid input",
        issues: parsed.error.flatten().fieldErrors,
      });
    }
    const { name, email, subject, message, website } = parsed.data;
    if (website && website.length > 0) {
      return res.status(201).json({ status: "success", message: "Message sent successfully" });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: { name, email, subject: subject || undefined, message },
    });

    res.status(201).json({
      status: "success",
      message: "Message sent successfully",
      data: contactMessage,
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const page = Math.min(Math.max(Number(req.query.page) || 1, 1), 1000);
      const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
      const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      });
      res.json({ status: "success", data: messages, page, limit });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:id",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id || "").slice(0, 100);
      const message = await prisma.contactMessage.findUnique({ where: { id } });
      if (!message) {
        return res.status(404).json({ status: "error", message: "Not found" });
      }
      res.json({ status: "success", data: message });
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
      const parsed = markReadSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ status: "error", message: "read must be a boolean" });
      }
      const message = await prisma.contactMessage.update({
        where: { id },
        data: { read: parsed.data.read },
      });
      res.json({ status: "success", data: message });
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
      await prisma.contactMessage.delete({ where: { id } });
      res.json({ status: "success", message: "Deleted" });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
