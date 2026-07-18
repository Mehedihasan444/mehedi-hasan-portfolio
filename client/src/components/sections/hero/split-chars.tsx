"use client";

import { motion } from "framer-motion";

export function SplitChars({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className={`scroll-char ${className || ""}`}
          aria-hidden="true"
          initial={{ opacity: 1, y: 0, rotateX: 0 }}
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
