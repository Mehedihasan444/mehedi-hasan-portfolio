"use client";

import { useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: number;
  borderGlow?: boolean;
  staticGlow?: boolean;
}

export function GlowCard({
  children,
  className,
  glowColor = "5, 150, 105",
  intensity = 0.15,
  borderGlow = true,
  staticGlow = false,
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || staticGlow) return;
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY, staticGlow],
  );

  const handleMouseLeave = useCallback(() => {
    if (staticGlow) return;
    mouseX.set(-200);
    mouseY.set(-200);
  }, [mouseX, mouseY, staticGlow]);

  const spotlightX = useTransform(mouseX, (x) => `${x}px`);
  const spotlightY = useTransform(mouseY, (y) => `${y}px`);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "bg-[rgba(10,12,28,0.6)]",
        "backdrop-blur-xl",
        borderGlow ? "glow-border" : "border border-white/5",
        "transition-all duration-500",
        className,
      )}
    >
      {/* Mouse-reactive spotlight */}
      {!staticGlow && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${spotlightX} ${spotlightY}, rgba(${glowColor}, ${intensity}), transparent 60%)`,
          }}
        />
      )}

      {/* Static inner glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-all duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px at 50% -20%, rgba(${glowColor}, 0.04), transparent)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
