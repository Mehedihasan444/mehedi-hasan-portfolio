import { Router, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../../config/database";
import { authenticate, type AuthRequest } from "../../middleware/auth";

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
  website: z.string().max(0).optional().or(z.literal("")), // honeypot — must be empty
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
    const { name, email, subject, message, website } = parsed.data as z.infer<
      typeof contactSchema
    > & { website?: string };
    // Honeypot check — silently accept but don't store if filled (bot)
    if (website && website.length > 0) {
      return res.status(201).json({ status: "success", message: "Message sent successfully" });
    }
    if (!name || !email || !message) {
      return res.status(400).json({
        status: "error",
        message: "Name, email, and message are required",
      });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: { name, email, subject, message },
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

router.get("/", authenticate, async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ status: "success", data: messages });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const message = await prisma.contactMessage.findUnique({ where: { id } });
    if (!message) {
      return res.status(404).json({ status: "error", message: "Not found" });
    }
    res.json({ status: "success", data: message });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { read: req.body.read ?? undefined },
    });
    res.json({ status: "success", data: message });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await prisma.contactMessage.delete({ where: { id } });
    res.json({ status: "success", message: "Deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
