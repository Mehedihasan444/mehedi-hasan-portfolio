"use client";

import { motion } from "framer-motion";

export function ScrollIndicator({ onClick }: { onClick: () => void }) {
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
