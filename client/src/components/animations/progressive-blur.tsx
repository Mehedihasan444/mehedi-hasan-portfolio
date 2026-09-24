"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

interface ProgressiveBlurProps {
  direction?: "top" | "bottom" | "left" | "right";
  className?: string;
  blurAmount?: number;
  height?: string;
  children?: React.ReactNode;
}

export function ProgressiveBlur({
  direction = "bottom",
  className = "",
  blurAmount = 20,
  height = "40vh",
  children,
}: ProgressiveBlurProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Skip animation: show final state.
      el.style.opacity = "1";
      el.style.filter = "blur(0px)";
      return;
    }

    const fallback = setTimeout(() => {
      el.style.opacity = "1";
      el.style.filter = "blur(0px)";
    }, 3000);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, filter: `blur(${blurAmount}px)` },
        {
          opacity: 1,
          filter: "blur(0px)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "top 40%",
            scrub: 1,
          },
          onComplete: () => clearTimeout(fallback),
        },
      );
    }, el);

    return () => {
      clearTimeout(fallback);
      ctx.revert();
    };
  }, [blurAmount]);

  const maskDirection = {
    top: "to bottom",
    bottom: "to top",
    left: "to right",
    right: "to left",
  };

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ height }}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage: `linear-gradient(${maskDirection[direction]}, transparent 0%, black 50%, transparent 100%)`,
          WebkitMaskImage: `linear-gradient(${maskDirection[direction]}, transparent 0%, black 50%, transparent 100%)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
