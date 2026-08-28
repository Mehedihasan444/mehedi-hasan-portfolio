"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function PageTransitionWrapper({ children }: { children: ReactNode }) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function PageTransitionOverlay() {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname + "-overlay"}
        initial={{ scaleY: 1, originY: 0 }}
        animate={{ scaleY: 0, originY: 1 }}
        exit={{ scaleY: 1, originY: 0 }}
        transition={{ duration: 0.6, ease: [0.83, 0, 0.17, 1] }}
        className="from-emerald via-teal fixed inset-0 z-[100] bg-gradient-to-b"
        style={{ transformOrigin: "top" }}
      />
    </AnimatePresence>
  );
}
