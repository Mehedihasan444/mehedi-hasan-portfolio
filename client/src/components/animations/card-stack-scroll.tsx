"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CardStackScrollProps {
  children: React.ReactNode[];
  className?: string;
}

export function CardStackScroll({ children, className = "" }: CardStackScrollProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = children.length;

  // Auto-play interval
  useEffect(() => {
    if (total <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(interval);
  }, [total]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  if (total === 0) return null;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Cards stack container */}
      <div className="relative flex h-[340px] w-full max-w-[600px] items-center justify-center sm:h-[300px]">
        <AnimatePresence mode="popLayout">
          {children.map((child, i) => {
            // Calculate relative index from activeIndex
            const relativeIndex = (i - activeIndex + total) % total;
            const isVisible = relativeIndex < 2; // Only show top 2 cards for clean stacking

            if (!isVisible) return null;

            // Define styles based on stack depth
            const isTop = relativeIndex === 0;
            const depth = relativeIndex;

            return (
              <motion.div
                key={i}
                style={{
                  zIndex: total - depth,
                  transformOrigin: "center bottom",
                }}
                animate={{
                  y: depth * 16,
                  scale: 1 - depth * 0.05,
                  opacity: depth === 0 ? 1 : 0.6,
                  rotate: isTop ? 0 : i % 2 === 0 ? 2 : -2,
                }}
                initial={{
                  y: 40,
                  scale: 0.9,
                  opacity: 0,
                }}
                exit={{
                  x: -150,
                  opacity: 0,
                  scale: 0.9,
                  rotate: -8,
                  transition: { duration: 0.4 },
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                onClick={isTop ? handleNext : undefined}
                className={`absolute w-full cursor-pointer select-none`}
              >
                {child}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Manual Navigation Controls */}
      {total > 1 && (
        <div className="mt-8 flex items-center gap-6">
          <button
            onClick={handlePrev}
            className="text-muted-foreground hover:border-emerald/40 hover:bg-emerald/5 hover:text-emerald flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {children.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === i ? "bg-emerald w-6" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="text-muted-foreground hover:border-emerald/40 hover:bg-emerald/5 hover:text-emerald flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
