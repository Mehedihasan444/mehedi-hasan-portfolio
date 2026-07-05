"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const projects = [
  {
    title: "MarketSphere",
    description:
      "A multivendor e-commerce platform with product management, cart system, payment integration, and vendor dashboards.",
    tech: ["React", "Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    github: "https://github.com/Mehedihasan444/marketsphere-frontend",
    status: "In Development",
  },
  {
    title: "Tech Tips & Tricks Hub",
    description:
      "A content platform for sharing technical tutorials, tips, and tricks. Features blog posts, code snippets, and community interaction.",
    tech: ["React", "Next.js", "TypeScript", "MongoDB", "Mongoose"],
    github: "https://github.com/Mehedihasan444/tech-tips-and-tricks-hub-frontend",
    status: "Completed",
  },
  {
    title: "Car Rental Reservation System",
    description:
      "A full-stack car rental platform with vehicle browsing, booking management, payment processing, and admin dashboard.",
    tech: ["React", "TypeScript", "Node.js", "Express", "MongoDB"],
    github: "https://github.com/Mehedihasan444/Car-Rental-Reservation-System-Frontend",
    status: "Completed",
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="relative overflow-hidden px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-widest">
            Portfolio
          </p>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            A selection of projects that showcase my skills and passion for building exceptional
            digital experiences
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative"
    >
      <div className="glass glass-hover glow-border rounded-xl p-6 transition-all duration-300">
        <div className="flex items-start justify-between">
          <span className="bg-cyan/10 text-cyan rounded-full px-3 py-1 text-xs">
            {project.status}
          </span>
        </div>

        <h3 className="group-hover:text-gradient mt-4 text-xl font-semibold text-white transition-all">
          {project.title}
        </h3>

        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{project.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-muted-foreground rounded-full bg-white/5 px-2.5 py-0.5 text-xs"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <Link
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground text-sm transition-colors hover:text-white"
          >
            GitHub &rarr;
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
