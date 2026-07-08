"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  containerClassName?: string;
}

export function ParallaxImage({
  src,
  alt,
  className = "",
  speed = 0.3,
  containerClassName = "",
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <div ref={ref} className={`overflow-hidden ${containerClassName}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
      />
    </div>
  );
}
