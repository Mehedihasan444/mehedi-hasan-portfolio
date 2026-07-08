import { Router, type Request, type Response, type NextFunction } from "express";
import { prisma } from "../../config/database";

const router = Router();

router.get("/slug/:slug", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: req.params.slug as string },
    });

    if (!project) {
      return res.status(404).json({ status: "error", message: "Project not found" });
    }

    res.json({ status: "success", data: project });
  } catch (error) {
    next(error);
  }
});

export default router;
