import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@mehedi.dev";
  const adminPassword = process.env.ADMIN_PASSWORD;
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    if (!adminPassword) {
      console.log("Skipping admin creation: set ADMIN_PASSWORD (>=12 chars) to seed admin.");
    } else {
      const hashed = await bcrypt.hash(adminPassword, 12);
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashed,
          name: "Mehedi Hasan",
          role: "admin",
        },
      });
      console.log(`Admin user created: ${adminEmail}`);
    }
  }

  const settings = [
    { key: "site_name", value: "Mehedi Hasan" },
    { key: "site_title", value: "Mehedi Hasan - Full Stack Developer" },
    {
      key: "site_description",
      value:
        "Full Stack Developer specializing in React, Next.js, Node.js, and TypeScript. Building scalable web applications with modern technologies.",
    },
    {
      key: "site_keywords",
      value:
        "Full Stack Developer, Software Engineer, React, Next.js, TypeScript, Node.js, Bangladesh",
    },
    { key: "email", value: "mehedihasan67705251@gmail.com" },
    { key: "phone", value: "+8801767705251" },
    { key: "location", value: "Dhaka, Bangladesh" },
    { key: "available", value: "true" },
    { key: "available_for", value: "Freelance projects and full-time opportunities" },
    { key: "github_url", value: "https://github.com/Mehedihasan444" },
    { key: "linkedin_url", value: "https://linkedin.com/in/mehedi-hasan-893500301" },
    { key: "twitter_url", value: "https://twitter.com/MEHEDIH60833052" },
    { key: "resume_url", value: "" },
    {
      key: "about_me",
      value:
        "Full Stack Developer passionate about creating elegant solutions to complex problems. With 1+ years of experience in full-stack development, I specialize in building scalable web applications using React, Next.js, Node.js, and TypeScript. I'm dedicated to writing clean, maintainable code and continuously learning new technologies.",
    },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  const sectionKeys = [
    "section_hero",
    "section_about",
    "section_skills",
    "section_experience",
    "section_projects",
    "section_education",
    "section_certifications",
    "section_achievements",
    "section_github",
    "section_testimonials",
    "section_blog",
    "section_contact",
  ];

  for (const key of sectionKeys) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: "true" },
      create: { key, value: "true" },
    });
  }

  const skills = [
    { name: "React", category: "Frontend", proficiency: 90, order: 1 },
    { name: "Next.js", category: "Frontend", proficiency: 85, order: 2 },
    { name: "TypeScript", category: "Language", proficiency: 85, order: 3 },
    { name: "JavaScript", category: "Language", proficiency: 90, order: 4 },
    { name: "Node.js", category: "Backend", proficiency: 85, order: 5 },
    { name: "Express.js", category: "Backend", proficiency: 85, order: 6 },
    { name: "MongoDB", category: "Database", proficiency: 80, order: 7 },
    { name: "PostgreSQL", category: "Database", proficiency: 80, order: 8 },
    { name: "Prisma", category: "Database", proficiency: 80, order: 9 },
    { name: "Mongoose", category: "Database", proficiency: 75, order: 10 },
    { name: "Redux", category: "Frontend", proficiency: 80, order: 11 },
    { name: "Git", category: "Tools", proficiency: 85, order: 12 },
    { name: "Python", category: "Language", proficiency: 65, order: 13 },
    { name: "Java", category: "Language", proficiency: 60, order: 14 },
    { name: "C", category: "Language", proficiency: 55, order: 15 },
    { name: "C++", category: "Language", proficiency: 55, order: 16 },
    { name: "Tailwind CSS", category: "Frontend", proficiency: 90, order: 17 },
    { name: "Docker", category: "Tools", proficiency: 60, order: 18 },
  ];

  for (const skill of skills) {
    const existing = await prisma.skill.findFirst({ where: { name: skill.name } });
    if (!existing) {
      await prisma.skill.create({ data: skill });
    }
  }

  const existingExp = await prisma.experience.findFirst();
  if (!existingExp) {
    await prisma.experience.create({
      data: {
        company: "Freelance / Self-Employed",
        role: "Full Stack Developer",
        description:
          "Building scalable web applications for clients using React, Next.js, Node.js, and modern technologies. Delivering end-to-end solutions from conception to deployment.",
        startDate: new Date("2024-01-01"),
        current: true,
        location: "Dhaka, Bangladesh",
        type: "full-time",
      },
    });
  }

  const projects = [
    {
      title: "MarketSphere",
      slug: "marketsphere",
      description:
        "A multivendor e-commerce platform with product management, cart system, payment integration, and vendor dashboards.",
      content: `## Overview

MarketSphere is a comprehensive multivendor e-commerce platform designed to connect buyers and sellers in a seamless digital marketplace. Built with modern web technologies, it provides a robust foundation for online commerce with features tailored for both vendors and customers.

## Key Features

- **Multi-vendor Architecture**: Independent vendor dashboards with individual product management
- **Product Management**: Rich product catalog with categories, variants, and inventory tracking
- **Shopping Cart**: Real-time cart management with persistent state across sessions
- **Payment Integration**: Secure payment processing with Stripe integration
- **Vendor Analytics**: Comprehensive sales analytics and reporting dashboards
- **Search & Filtering**: Advanced search with faceted filtering and full-text search

## Technical Highlights

The application leverages Next.js for server-side rendering and static generation, ensuring optimal performance and SEO. PostgreSQL with Prisma provides a type-safe database layer, while Tailwind CSS delivers a responsive, modern UI. The architecture follows a modular pattern with clear separation of concerns.`,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      ]),
      techStack: JSON.stringify([
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Prisma",
        "Tailwind CSS",
      ]),
      githubUrl: "https://github.com/Mehedihasan444/marketsphere-frontend",
      featured: true,
      order: 1,
      status: "published",
    },
    {
      title: "Tech Tips & Tricks Hub",
      slug: "tech-tips-tricks-hub",
      description:
        "A content platform for sharing technical tutorials, tips, and tricks for developers. Features blog posts, code snippets, and community interaction.",
      content: `## Overview

Tech Tips & Tricks Hub is a community-driven content platform that enables developers to share knowledge through tutorials, code snippets, and technical articles. The platform fosters learning and collaboration within the developer community.

## Key Features

- **Rich Content Editor**: Full-featured markdown editor with syntax highlighting and preview
- **Code Snippets**: Share executable code snippets with language detection and formatting
- **Community Interaction**: Comments, likes, and bookmarking system for user engagement
- **Content Categories**: Organized content with tags, categories, and search
- **User Profiles**: Personalized profiles with contribution history and reputation

## Technical Highlights

Built with MongoDB for flexible content storage and Mongoose for elegant data modeling. The Next.js frontend provides fast page loads through static generation, while dynamic routes handle individual posts efficiently.`,
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
        "https://images.unsplash.com/photo-1432889821006-3149403d3b1a?w=800&q=80",
        "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80",
      ]),
      techStack: JSON.stringify([
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "MongoDB",
        "Mongoose",
      ]),
      githubUrl: "https://github.com/Mehedihasan444/tech-tips-and-tricks-hub-frontend",
      featured: true,
      order: 2,
      status: "published",
    },
    {
      title: "Car Rental Reservation System",
      slug: "car-rental-reservation-system",
      description:
        "A full-stack car rental platform with vehicle browsing, booking management, payment processing, and admin dashboard.",
      content: `## Overview

A complete car rental reservation system that handles the entire booking lifecycle — from vehicle browsing and reservation to payment processing and fleet management. Designed for both customers and rental agencies.

## Key Features

- **Vehicle Browsing**: Advanced filtering by make, model, year, price range, and availability
- **Booking Management**: Real-time availability checking, reservation creation, and modification
- **Payment Processing**: Secure Stripe integration with multiple payment methods
- **Admin Dashboard**: Fleet management, booking oversight, revenue tracking, and customer management
- **Email Notifications**: Automated booking confirmations, reminders, and receipts

## Technical Highlights

The backend uses Express.js with a clean MVC architecture. MongoDB provides flexible document storage for vehicle specifications and booking records. The frontend features responsive design with smooth transitions and real-time availability updates.`,
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
        "https://images.unsplash.com/photo-1550355291-bedd04e1420a?w=800&q=80",
      ]),
      techStack: JSON.stringify([
        "React",
        "TypeScript",
        "Node.js",
        "Express",
        "MongoDB",
        "Mongoose",
      ]),
      githubUrl: "https://github.com/Mehedihasan444/Car-Rental-Reservation-System-Frontend",
      featured: true,
      order: 3,
      status: "published",
    },
  ];

  for (const project of projects) {
    const existing = await prisma.project.findUnique({ where: { slug: project.slug } });
    if (!existing) {
      await prisma.project.create({ data: project });
    }
  }

  const seoPages = [
    {
      page: "home",
      title: "Mehedi Hasan - Full Stack Developer",
      description:
        "Full Stack Developer specializing in React, Next.js, Node.js, and TypeScript. Building scalable web applications with modern technologies.",
      keywords: "Full Stack Developer, React Developer, Next.js Developer, TypeScript, Bangladesh",
    },
    {
      page: "projects",
      title: "Projects - Mehedi Hasan",
      description:
        "Browse my portfolio of web development projects built with React, Next.js, Node.js, and modern technologies.",
      keywords: "web development projects, React projects, Next.js projects, full stack projects",
    },
    {
      page: "contact",
      title: "Contact - Mehedi Hasan",
      description:
        "Get in touch with Mehedi Hasan for freelance projects, collaborations, or full-time opportunities.",
      keywords: "contact Mehedi Hasan, hire full stack developer, freelance developer Bangladesh",
    },
  ];

  for (const seo of seoPages) {
    await prisma.seoMetadata.upsert({
      where: { page: seo.page },
      update: seo,
      create: seo,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
