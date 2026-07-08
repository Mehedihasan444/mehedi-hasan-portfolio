"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TechBadgeProps {
  name: string;
  icon?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
  delay?: number;
}

const sizeStyles = {
  sm: "px-2.5 py-1 text-xs gap-1.5",
  md: "px-3.5 py-1.5 text-sm gap-2",
  lg: "px-4 py-2 text-base gap-2.5",
};

const variantStyles = {
  default:
    "bg-violet/10 border border-violet/20 text-violet-soft hover:bg-violet/20 hover:border-violet/40",
  outline:
    "bg-transparent border border-white/10 text-muted-foreground hover:border-violet/30 hover:text-violet-soft",
  ghost:
    "bg-white/3 border border-transparent text-muted-foreground hover:bg-violet/10 hover:text-violet-soft",
};

export function TechBadge({
  name,
  icon,
  className,
  size = "md",
  variant = "default",
  delay = 0,
}: TechBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={{ scale: 1.06, y: -2 }}
      className={cn(
        "inline-flex cursor-default select-none items-center rounded-full font-medium transition-all duration-300",
        sizeStyles[size],
        variantStyles[variant],
        className,
      )}
    >
      {icon && <span className="text-base leading-none">{icon}</span>}
      {name}
    </motion.span>
  );
}

interface TechBadgeGroupProps {
  technologies: string[];
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export function TechBadgeGroup({
  technologies,
  className,
  size = "sm",
  variant = "ghost",
}: TechBadgeGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {technologies.map((tech, i) => (
        <TechBadge key={tech} name={tech} size={size} variant={variant} delay={i * 0.05} />
      ))}
    </div>
  );
}
