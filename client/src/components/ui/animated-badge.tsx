"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AnimatedBadgeProps {
  children: React.ReactNode;
  className?: string;
  dotColor?: string;
  variant?: "available" | "info" | "new" | "hot";
  animate?: boolean;
}

const variantStyles = {
  available: {
    wrapper: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    dot: "bg-emerald-400",
    ping: "bg-emerald-400",
  },
  info: {
    wrapper: "border-violet/30 bg-violet/10 text-violet-soft",
    dot: "bg-violet-soft",
    ping: "bg-violet-soft",
  },
  new: {
    wrapper: "border-cyan/30 bg-cyan/10 text-cyan-soft",
    dot: "bg-cyan-400",
    ping: "bg-cyan-400",
  },
  hot: {
    wrapper: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    dot: "bg-rose-400",
    ping: "bg-rose-400",
  },
};

export function AnimatedBadge({
  children,
  className,
  variant = "available",
  animate = true,
}: AnimatedBadgeProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium backdrop-blur-sm",
        styles.wrapper,
        className,
      )}
    >
      {animate && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              styles.ping,
            )}
          />
          <span className={cn("relative inline-flex h-2 w-2 rounded-full", styles.dot)} />
        </span>
      )}
      {!animate && <span className={cn("h-2 w-2 rounded-full", styles.dot)} />}
      {children}
    </motion.div>
  );
}
