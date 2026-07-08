"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid auto-rows-[minmax(160px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  delay?: number;
  glowColor?: string;
  hover?: boolean;
}

export function BentoCard({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
  delay = 0,
  glowColor = "5, 150, 105",
  hover = true,
}: BentoCardProps) {
  const colClass = {
    1: "",
    2: "sm:col-span-2",
    3: "sm:col-span-2 lg:col-span-3",
  }[colSpan];

  const rowClass = {
    1: "",
    2: "row-span-2",
  }[rowSpan];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 1.02, 0.73, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "bg-[rgba(10,12,28,0.55)] backdrop-blur-xl",
        "border border-white/[0.06]",
        "transition-all duration-500",
        hover && "hover:border-violet/20 hover:shadow-violet/5 hover:shadow-lg",
        colClass,
        rowClass,
        className,
      )}
    >
      {/* Mouse-reactive inner glow */}
      {hover && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(500px at 50% 0%, rgba(${glowColor}, 0.06), transparent)`,
          }}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
