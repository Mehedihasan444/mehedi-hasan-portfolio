"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Hero3DWrapper } from "@/components/3d/hero-3d-wrapper";

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      <Hero3DWrapper />

      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="via-background/20 to-background absolute inset-0 bg-gradient-to-b from-transparent" />
      </div>

      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 mx-auto max-w-5xl text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-widest"
        >
          Full Stack Developer
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span className="text-white">Hi, I&apos;m </span>
          <span className="text-gradient">Mehedi Hasan</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl"
        >
          Crafting elegant solutions and scalable applications with expertise in modern web
          technologies. I build experiences that live at the intersection of design and engineering.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="#projects"
            className="from-cyan to-purple group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r px-8 py-3 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <span className="relative z-10">View My Work</span>
          </Link>
          <Link
            href="#contact"
            className="text-muted-foreground group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/10 px-8 py-3 text-sm font-medium transition-all duration-300 hover:border-white/20 hover:text-white"
          >
            Get In Touch
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-muted-foreground text-xs">Scroll</span>
            <div className="from-muted-foreground h-8 w-px bg-gradient-to-b to-transparent" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
