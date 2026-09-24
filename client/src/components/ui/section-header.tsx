"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  label?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
  titleClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  delay?: number;
}

export function SectionHeader({
  label,
  title,
  description,
  align = "center",
  className,
  titleClassName,
  labelClassName,
  descriptionClassName,
  delay = 0,
}: SectionHeaderProps) {
  const alignClass = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  }[align];

  return (
    <div className={cn("flex flex-col gap-4", alignClass, className)}>
      {label && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay }}
          className={cn(
            "section-label flex items-center gap-3",
            align === "center" && "justify-center",
            labelClassName,
          )}
        >
          <span className="h-px w-8 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-60" />
          {label}
          <span className="h-px w-8 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-60" />
        </motion.p>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: delay + 0.1, ease: [0.21, 1.02, 0.73, 1] }}
        className={cn(
          "font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl",
          titleClassName,
        )}
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          className={cn(
            "text-muted-foreground max-w-2xl text-lg leading-relaxed",
            align === "center" && "mx-auto",
            descriptionClassName,
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
