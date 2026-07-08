"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StaggerRevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  once?: boolean;
}

const directionMap = {
  up: { y: 32 },
  down: { y: -32 },
  left: { x: 32 },
  right: { x: -32 },
  none: {},
};

export function StaggerReveal({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  direction = "up",
  distance,
  duration = 0.65,
  once = true,
}: StaggerRevealProps) {
  const initial = distance
    ? direction === "up"
      ? { y: distance, opacity: 0 }
      : direction === "down"
        ? { y: -distance, opacity: 0 }
        : direction === "left"
          ? { x: distance, opacity: 0 }
          : direction === "right"
            ? { x: -distance, opacity: 0 }
            : { opacity: 0 }
    : { ...directionMap[direction], opacity: 0 };

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: initial,
                visible: {
                  x: 0,
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration,
                    ease: [0.21, 1.02, 0.73, 1],
                  },
                },
              }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
