"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { Typewriter } from "@/components/animations/typewriter";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/icons";
import { TerminalBlock } from "./terminal-block";
import { stats, roles } from "./constants";

const socialLinks = [
  { href: "https://github.com/Mehedihasan444", icon: GithubIcon, label: "GitHub" },
  { href: "https://linkedin.com/in/mehedi-hasan-893500301", icon: LinkedinIcon, label: "LinkedIn" },
  { href: "https://twitter.com/MEHEDIH60833052", icon: TwitterIcon, label: "Twitter" },
];

export function HeroContent() {
  return (
    <div className="mx-auto max-w-5xl text-center">
      <AnimatedBadge variant="available" className="mb-8">
        Available for new opportunities
      </AnimatedBadge>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="text-cyan-soft font-mono text-base sm:text-lg md:text-xl"
        aria-live="polite"
        aria-label="Current role"
      >
        <span className="text-violet-soft/60">{"// "}</span>
        <Typewriter words={roles} speed={55} deleteSpeed={30} />
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
      >
        Crafting elegant, scalable web applications at the intersection of design and engineering.
        Passionate about clean code, performance, and user experience.
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
        className="mt-8 flex flex-wrap items-center justify-center gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm"
      >
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5 px-6 py-4 sm:px-8">
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
        className="mt-8 flex flex-wrap items-center justify-center gap-4"
      >
        <MagneticButton>
          <Link
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="from-violet to-cyan shadow-violet/25 hover:shadow-violet/40 group inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-7 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105"
          >
            View My Work
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </MagneticButton>

        <MagneticButton strength={0.2}>
          <a
            href="/resume.pdf"
            download="Mehedi-Hasan-Resume.pdf"
            aria-label="Download CV as PDF"
            className="text-foreground/80 hover:border-violet/30 hover:bg-violet/5 hover:text-foreground group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-7 py-3 text-sm font-semibold backdrop-blur-sm transition-all duration-300"
          >
            <Download size={15} className="text-violet-soft" />
            Download CV
          </a>
        </MagneticButton>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="mt-8 flex items-center gap-4"
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
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/10" />
        <span className="text-muted-foreground/60 text-xs">mehedihasan67705251@gmail.com</span>
      </motion.div>
    </div>
  );
}
