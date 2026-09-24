"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DURATION_MS = 1500;
const TICK_MS = 100;
const STEP = 100 / (DURATION_MS / TICK_MS);

export function LoadingIntro() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount/external-system sync
    setReducedMotion(mq.matches);
    if (mq.matches) {
      // Skip animation for reduced-motion users: show final state (no blocking overlay).
      setProgress(100);
      setShow(false);
      return;
    }

    const timer = setInterval(() => {
      if (document.hidden) return;
      setProgress((prev) => {
        const next = Math.min(prev + STEP, 100);
        if (next >= 100) clearInterval(timer);
        return next;
      });
    }, TICK_MS);

    const timeout = setTimeout(() => {
      setShow(false);
    }, DURATION_MS);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, []);

  if (reducedMotion) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[oklch(0.04_0.01_260)]"
          role="status"
          aria-label="Loading experience"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <span className="text-gradient text-6xl font-bold">MH</span>
            </motion.div>

            <div className="mx-auto h-1 w-48 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="from-emerald to-teal h-full rounded-full bg-gradient-to-r"
                style={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground mt-4 text-xs"
            >
              Loading experience...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
