"use client";

import { useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  label?: string;
}

export function AnimatedCounter({
  end,
  duration = 2,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
  label,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const springValue = useSpring(0, {
    stiffness: 80,
    damping: 20,
    duration: duration * 1000,
  });

  const displayValue = useTransform(springValue, (val) => {
    return `${prefix}${val.toFixed(decimals)}${suffix}`;
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(end);
    }
  }, [isInView, end, springValue]);

  return (
    <div ref={ref} className={className}>
      <motion.span className="text-3xl font-bold text-white">{displayValue}</motion.span>
      {label && <p className="text-muted-foreground mt-1 text-sm">{label}</p>}
    </div>
  );
}

export function AnimatedCounterGroup({
  items,
  className = "",
}: {
  items: { end: number; prefix?: string; suffix?: string; label: string; decimals?: number }[];
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-2 gap-8 sm:grid-cols-4 ${className}`}>
      {items.map((item) => (
        <AnimatedCounter
          key={item.label}
          end={item.end}
          prefix={item.prefix}
          suffix={item.suffix}
          decimals={item.decimals}
          className="text-center"
          label={item.label}
        />
      ))}
    </div>
  );
}
