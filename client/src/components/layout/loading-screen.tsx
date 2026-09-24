"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Single-loader component: mounted once at the app root. There is exactly one
// loading overlay instance — do not render a second spinner elsewhere.
export function LoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"logo" | "bar" | "exit">("logo");

  useEffect(() => {
    // Only show on first visit
    const seen = sessionStorage.getItem("portfolio-loaded");
    if (seen) return;
    sessionStorage.setItem("portfolio-loaded", "1");

    // Defer state update to next tick to avoid synchronous cascading render warning/error
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 0);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const logoTimer = setTimeout(() => setPhase("bar"), 600);
    return () => clearTimeout(logoTimer);
  }, [visible]);

  useEffect(() => {
    if (phase !== "bar") return;

    let p = 0;
    let exitTimer: ReturnType<typeof setTimeout> | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    const interval = setInterval(() => {
      p += Math.random() * 22 + 8;
      if (p >= 100) {
        p = 100;
        setProgress(100);
        clearInterval(interval);
        exitTimer = setTimeout(() => setPhase("exit"), 300);
        hideTimer = setTimeout(() => setVisible(false), 900);
      } else {
        setProgress(Math.round(p));
      }
    }, 120);

    return () => {
      clearInterval(interval);
      if (exitTimer) clearTimeout(exitTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [phase]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050810]"
          aria-label="Loading portfolio"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${progress}% loaded`}
        >
          {/* Background grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(5,150,105,1) 1px, transparent 1px), linear-gradient(90deg, rgba(5,150,105,1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Radial glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="bg-violet/10 h-64 w-64 rounded-full blur-[120px]" />
          </div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative mb-12 flex h-20 w-20 items-center justify-center"
          >
            <div className="from-violet to-cyan animate-pulse-slow absolute inset-0 rounded-2xl bg-gradient-to-br opacity-20 blur-xl" />
            <div className="border-violet/30 from-violet/20 to-cyan/10 relative flex h-full w-full items-center justify-center rounded-2xl border bg-gradient-to-br">
              <span className="font-heading text-gradient text-2xl font-bold">MH</span>
            </div>
            {/* Orbiting dot — tailwind animate-spin wrapper (no custom keyframes). */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "2s" }}>
              <div className="bg-cyan absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full" />
            </div>
          </motion.div>

          {/* Name */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="font-heading text-muted-foreground mb-10 text-sm font-medium uppercase tracking-[0.3em]"
          >
            Mehedi Hasan
          </motion.p>

          {/* Progress bar */}
          <AnimatePresence>
            {phase !== "logo" && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                className="flex w-64 flex-col gap-3"
              >
                <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="from-violet to-cyan h-full rounded-full bg-gradient-to-r"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                </div>
                <p className="text-muted-foreground/50 text-center font-mono text-xs">
                  {progress}%
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
