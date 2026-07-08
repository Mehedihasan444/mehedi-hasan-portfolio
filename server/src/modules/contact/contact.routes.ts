import { Router, Response, NextFunction } from "express";
import { prisma } from "../../config/database";
import { authenticate, type AuthRequest } from "../../middleware/auth";

const router = Router();

router.post("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, subject, message } = req.body;

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
