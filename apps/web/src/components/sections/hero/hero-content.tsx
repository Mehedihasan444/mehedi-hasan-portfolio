"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Download, FileText } from "lucide-react";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { Typewriter } from "@/components/animations/typewriter";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/icons";
import { EMAIL, SOCIAL_LINKS } from "@/lib/constants";
import { TerminalBlock } from "./terminal-block";
import { stats, roles } from "./constants";

const socialLinks = [
  { href: SOCIAL_LINKS.github, icon: GithubIcon, label: "GitHub" },
  { href: SOCIAL_LINKS.linkedin, icon: LinkedinIcon, label: "LinkedIn" },
  { href: SOCIAL_LINKS.twitter, icon: TwitterIcon, label: "Twitter" },
];

const documents = {
  cv: {
    href: "/mehedi-hasan-cv.pdf",
    fileName: "Mehedi-Hasan-CV.pdf",
    label: "Download CV",
    description: "Full CV with research, publications and references",
  },
  resume: {
    href: "/mehedi-hasan-resume.pdf",
    fileName: "Mehedi-Hasan-Resume.pdf",
    label: "Download Resume",
    description: "Concise ATS-friendly one-page resume",
  },
} as const;

const downloadButtonClass =
  "text-foreground/80 hover:border-violet/30 hover:bg-violet/5 hover:text-foreground group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold backdrop-blur-sm transition-all duration-300 sm:w-auto sm:px-6 sm:py-3";

export function HeroContent() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl text-center">
      <AnimatedBadge variant="available" className="mb-8">
        Available for new opportunities
      </AnimatedBadge>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="text-cyan-soft w-full min-w-0 break-words font-mono text-sm sm:text-lg md:text-xl"
        aria-label={`Current roles: ${roles.join(", ")}`}
      >
        <span className="text-violet-soft/60">{"// "}</span>
        {/* Decorative fast typewriter — hidden from AT to avoid live-region spam. */}
        <span aria-hidden="true">
          <Typewriter words={[...roles]} speed={55} deleteSpeed={30} />
        </span>
        <span className="sr-only">{roles[0]}</span>
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="text-foreground/85 mx-auto mt-6 w-full min-w-0 max-w-2xl text-balance break-words text-base leading-relaxed sm:text-lg"
      >
        I build, secure and deploy production-ready web applications with React, Next.js,
        TypeScript, Node.js and Express.js — from database design and APIs to authentication,
        payments and CI/CD.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 0.6 }}
        className="mt-6 flex w-full justify-center"
      >
        <TerminalBlock />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="mt-8 grid w-full min-w-0 grid-cols-2 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm sm:mx-auto sm:flex sm:w-fit sm:flex-wrap sm:items-center sm:justify-center sm:gap-px"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex min-w-0 flex-col items-center gap-0.5 px-4 py-4 sm:px-8"
          >
            <span className="font-heading text-gradient text-2xl font-bold sm:text-3xl">
              {stat.value}
            </span>
            <span className="text-muted-foreground text-xs">{stat.label}</span>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="mt-8 flex w-full min-w-0 flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center"
      >
        <MagneticButton className="w-full sm:w-auto [&>div]:w-full">
          <Link
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="from-violet to-cyan shadow-violet/25 hover:shadow-violet/40 group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 sm:w-auto sm:px-7 sm:py-3"
          >
            View My Work
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </MagneticButton>

        <div
          className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          role="group"
          aria-label="Download documents"
        >
          <MagneticButton strength={0.2} className="w-full sm:w-auto [&>div]:w-full">
            <a
              href={documents.cv.href}
              download={documents.cv.fileName}
              type="application/pdf"
              aria-label={`${documents.cv.label} — Mehedi Hasan, PDF (${documents.cv.description})`}
              className={downloadButtonClass}
            >
              <FileText size={15} aria-hidden="true" className="text-violet-soft" />
              {documents.cv.label}
              <Download
                size={13}
                aria-hidden="true"
                className="text-muted-foreground/60 transition-transform duration-300 group-hover:translate-y-0.5"
              />
            </a>
          </MagneticButton>

          <MagneticButton strength={0.2} className="w-full sm:w-auto [&>div]:w-full">
            <a
              href={documents.resume.href}
              download={documents.resume.fileName}
              type="application/pdf"
              aria-label={`${documents.resume.label} — Mehedi Hasan, PDF (${documents.resume.description})`}
              className={downloadButtonClass}
            >
              <FileText size={15} aria-hidden="true" className="text-emerald" />
              {documents.resume.label}
              <Download
                size={13}
                aria-hidden="true"
                className="text-muted-foreground/60 transition-transform duration-300 group-hover:translate-y-0.5"
              />
            </a>
          </MagneticButton>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="mt-8 flex w-full min-w-0 flex-wrap items-center justify-center gap-3 sm:gap-4"
      >
        {socialLinks.map((s) => (
          <a
            key={s.href}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="border-white/8 text-muted-foreground hover:border-violet/30 hover:bg-violet/10 hover:text-violet-soft group flex h-10 w-10 items-center justify-center rounded-xl border bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:scale-110"
          >
            <s.icon className="h-4 w-4" />
          </a>
        ))}
        <div className="hidden h-px w-8 bg-gradient-to-r from-transparent to-white/10 sm:block" />
        <a
          href={`mailto:${EMAIL}`}
          className="text-muted-foreground/60 hover:text-muted-foreground min-w-0 break-all text-xs underline-offset-4 transition-colors hover:underline"
        >
          {EMAIL}
        </a>
      </motion.div>
    </div>
  );
}
