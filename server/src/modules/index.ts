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
router.use("/projects", createCrudRoutes(prisma.project, { publicRead: true }));
router.use("/skills", createCrudRoutes(prisma.skill, { publicRead: true }));
router.use("/experiences", createCrudRoutes(prisma.experience, { publicRead: true }));
router.use("/blog", createCrudRoutes(prisma.blogPost, { publicRead: true }));
router.use("/testimonials", createCrudRoutes(prisma.testimonial, { publicRead: true }));
router.use("/contact", contactRoutes);
router.use("/education", createCrudRoutes(prisma.education, { publicRead: true }));
router.use("/certifications", createCrudRoutes(prisma.certification, { publicRead: true }));
router.use("/achievements", createCrudRoutes(prisma.achievement, { publicRead: true }));
router.use("/contributions", createCrudRoutes(prisma.openSourceContribution, { publicRead: true }));
router.use("/research", createCrudRoutes(prisma.research, { publicRead: true }));
router.use("/site-settings", createCrudRoutes(prisma.siteSetting, { publicRead: true }));
router.use("/seo", createCrudRoutes(prisma.seoMetadata));
router.use("/upload", uploadRoutes);

export default router;
