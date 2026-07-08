"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
        },
      );
    }, el);

    return () => ctx.revert();
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
