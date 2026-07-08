"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { AuroraShaderBackground } from "@/components/ui/animated-shader-background";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { Typewriter } from "@/components/animations/typewriter";
import { ArrowRight, Download } from "lucide-react";
import { CharacterScrollOut } from "@/components/animations/character-scroll-out";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...props}>
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "1+", label: "Years Exp." },
  { value: "10+", label: "Projects" },
  { value: "18+", label: "Technologies" },
  { value: "Open", label: "to Work" },
];

const roles = [
  "Full Stack Developer",
  "React & Next.js Engineer",
  "Backend Developer",
  "Open Source Contributor",
  "UI/UX Enthusiast",
];

const socialLinks = [
  {
    href: "https://github.com/Mehedihasan444",
    icon: GithubIcon,
    label: "GitHub",
  },
  {
    href: "https://linkedin.com/in/mehedi-hasan-893500301",
    icon: LinkedinIcon,
    label: "LinkedIn",
  },
  {
    href: "https://twitter.com/MEHEDIH60833052",
    icon: TwitterIcon,
    label: "Twitter",
  },
];

// Terminal line animation
const terminalLines = [
  { prefix: "~", cmd: "npx create-next-app portfolio", delay: 0.2 },
  { prefix: "~", cmd: "cd portfolio && npm install", delay: 1.8 },
  { prefix: "~", cmd: "npm run dev", delay: 3.2 },
];

function TerminalBlock() {
  return (
    <div
      className="glass mt-8 hidden w-full max-w-md rounded-xl p-4 font-mono text-xs sm:block"
      aria-hidden="true"
    >
      <div className="mb-3 flex items-center gap-1.5">
        <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="text-muted-foreground/40 ml-2 text-[10px]">portfolio — zsh</span>
      </div>
      {terminalLines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: line.delay + 1.4, duration: 0.3 }}
          className="flex gap-2"
        >
          <span className="text-emerald">❯</span>
          <TypedText text={line.cmd} delay={line.delay + 1.5} />
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 0.3 }}
        className="text-emerald/70 mt-1"
      >
        ✓ Ready on http://localhost:3000
      </motion.div>
    </div>
  );
}

function TypedText({ text, delay }: { text: string; delay: number }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i <= text.length) {
          setDisplayed(text.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <span className="text-white/80">
      {displayed}
      {displayed.length < text.length && (
        <span className="bg-emerald animate-cursor-blink ml-0.5 inline-block h-3 w-0.5" />
      )}
    </span>
  );
}

// Split text per-character with clip-path reveal
function SplitChars({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className={`scroll-char ${className || ""}`}
          aria-hidden="true"
          initial={{ opacity: 0, y: 60, rotateX: -40 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.3 + i * 0.03,
            ease: [0.21, 1.02, 0.73, 1],
          }}
          style={{
            display: "inline-block",
            whiteSpace: char === " " ? "pre" : "normal",
            backfaceVisibility: "hidden",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </>
  );
}

// Premium circular scroll indicator
function ScrollIndicator({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.8 }}
      onClick={onClick}
      aria-label="Scroll to About section"
      className="group absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
    >
      <div className="relative h-12 w-12">
        <svg
          className="text-emerald/30 h-full w-full -rotate-90"
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden
        >
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
          <motion.circle
            cx="24"
            cy="24"
            r="20"
            stroke="url(#scroll-grad)"
            strokeWidth="1.5"
            strokeDasharray="125.6"
            strokeDashoffset="125.6"
            animate={{ strokeDashoffset: 0 }}
            transition={{ delay: 2.2, duration: 1.2, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="scroll-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            className="text-muted-foreground group-hover:text-violet-soft h-4 w-4 transition-colors duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>
      <span className="text-muted-foreground/40 group-hover:text-muted-foreground/70 font-mono text-[9px] uppercase tracking-[0.3em] transition-colors duration-300">
        Scroll
      </span>
    </motion.button>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: -80,
        opacity: 0.6,
        scale: 0.97,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "60% top",
          scrub: 1.2,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen flex-col overflow-hidden"
      aria-label="Hero — Mehedi Hasan"
    >
      {/* WebGL aurora shader background */}
      <AuroraShaderBackground className="absolute inset-0" />

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(5,150,105,1) 1px, transparent 1px), linear-gradient(90deg, rgba(5,150,105,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
        aria-hidden
      />

      {/* Radial vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 50%, transparent 30%, rgba(5,8,16,0.7) 100%)",
        }}
        aria-hidden
      />

      {/* Top content — everything above the headline */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-24"
      >
        <div className="mx-auto max-w-5xl text-center">
          {/* Availability badge */}
          <AnimatedBadge variant="available" className="mb-8">
            Available for new opportunities
          </AnimatedBadge>

          {/* Typewriter role */}
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

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
          >
            Crafting elegant, scalable web applications at the intersection of design and
            engineering. Passionate about clean code, performance, and user experience.
          </motion.p>

          {/* Terminal block */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.6 }}
            className="mt-6 flex w-full justify-center"
          >
            <TerminalBlock />
          </motion.div>

          {/* Stats row */}
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

          {/* CTA buttons */}
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
                download
                className="text-foreground/80 hover:border-violet/30 hover:bg-violet/5 hover:text-foreground group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-7 py-3 text-sm font-semibold backdrop-blur-sm transition-all duration-300"
              >
                <Download size={15} className="text-violet-soft" />
                Download CV
              </a>
            </MagneticButton>
          </motion.div>

          {/* Social links */}
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
      </div>

      {/* Heading area — bottom-aligned, full-width, uppercase */}
      <CharacterScrollOut
        ariaLabel="Hi, I'm Mehedi Hasan"
        className="relative z-10 w-full px-6 pb-12 md:px-10"
      >
        <h1 className="font-heading text-center text-5xl font-bold uppercase leading-[1.08] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          <SplitChars text="Hi, I'm " />
          <SplitChars
            text="Mehedi Hasan"
            className="from-violet-soft via-violet to-cyan bg-gradient-to-r bg-clip-text text-transparent"
          />
        </h1>
      </CharacterScrollOut>

      {/* Premium scroll indicator */}
      <ScrollIndicator onClick={scrollToAbout} />
    </section>
  );
}
