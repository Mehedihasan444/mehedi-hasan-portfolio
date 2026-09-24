import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../../config/database";

const router = Router();

const slugSchema = z.string().trim().min(1).max(100);

router.get("/slug/:slug", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = slugSchema.safeParse(req.params.slug);
    if (!parsed.success) {
      return res.status(400).json({ status: "error", message: "Invalid slug" });
    }
    const project = await prisma.project.findUnique({
      where: { slug: parsed.data },
    });

    if (!project || project.status !== "published") {
      return res.status(404).json({ status: "error", message: "Project not found" });
    }

    res.json({ status: "success", data: project });
  } catch (error) {
    next(error);
  }
});

export default router;
