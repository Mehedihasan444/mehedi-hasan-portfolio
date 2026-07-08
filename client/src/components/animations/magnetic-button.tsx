"use client";

import { useRef, ReactNode, useCallback } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({ children, className = "", strength = 0.3 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      el.firstElementChild?.setAttribute(
        "style",
        `transform: translate(${x}px, ${y}px); transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)`,
      );
    },
    [strength],
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.firstElementChild?.setAttribute(
      "style",
      "transform: translate(0px, 0px); transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
    );
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
