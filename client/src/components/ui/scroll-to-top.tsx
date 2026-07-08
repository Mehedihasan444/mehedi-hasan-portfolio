"use client";

import {
  useScroll,
  useMotionValueEvent,
  useTransform,
  motion,
  AnimatePresence,
} from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  const circumference = 113.1;
  const dashOffset = useTransform(scrollYProgress, [0, 1], [circumference, 0]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setVisible(v > 0.08);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className={cn(
            "group fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center",
            "rounded-full bg-white/[0.04] backdrop-blur-lg",
            "border border-white/[0.08]",
            "shadow-emerald/5 shadow-lg",
            "hover:border-emerald/20 hover:bg-white/[0.08]",
            "transition-all duration-300",
          )}
        >
          <svg
            className="absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 40 40"
            fill="none"
          >
            <circle cx="20" cy="20" r="18" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
            <motion.circle
              cx="20"
              cy="20"
              r="18"
              stroke="url(#ring-grad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={circumference}
              style={{ strokeDashoffset: dashOffset }}
            />
            <defs>
              <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          <svg
            className="text-muted-foreground group-hover:text-emerald relative z-10 h-4 w-4 transition-colors duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
