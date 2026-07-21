import { Router } from "express";
import { prisma } from "../config/database";
import { createCrudRoutes } from "../utils/crud-factory";
import authRoutes from "./auth/auth.routes";
import contactRoutes from "./contact/contact.routes";
import projectRoutes from "./projects/projects.routes";
import uploadRoutes from "./upload/upload.routes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/projects", projectRoutes);
router.use("/projects", createCrudRoutes(prisma.project));
router.use("/skills", createCrudRoutes(prisma.skill));
router.use("/experiences", createCrudRoutes(prisma.experience));
router.use("/blog", createCrudRoutes(prisma.blogPost));
router.use("/testimonials", createCrudRoutes(prisma.testimonial));
router.use("/contact", contactRoutes);
router.use("/education", createCrudRoutes(prisma.education));
router.use("/certifications", createCrudRoutes(prisma.certification));
router.use("/achievements", createCrudRoutes(prisma.achievement));
router.use("/contributions", createCrudRoutes(prisma.openSourceContribution));
router.use("/research", createCrudRoutes(prisma.research));
router.use("/site-settings", createCrudRoutes(prisma.siteSetting));
router.use("/seo", createCrudRoutes(prisma.seoMetadata));
router.use("/upload", uploadRoutes);

export default router;
