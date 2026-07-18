"use client";

import { motion } from "framer-motion";
import { terminalLines } from "./constants";
import { TypedText } from "./typed-text";

export function TerminalBlock() {
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
