"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

interface SvgDividerProps {
  className?: string;
}

export function SvgDivider({ className = "" }: SvgDividerProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Skip animation: show final state (fully drawn stroke).
      path.style.strokeDasharray = "none";
      path.style.strokeDashoffset = "0";
      return;
    }

    const length = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    // Fallback: never leave the divider invisible if GSAP fails.
    const fallback = setTimeout(() => {
      path.style.strokeDashoffset = "0";
    }, 3000);

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: path,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
        onComplete: () => clearTimeout(fallback),
      });
    }, path);

    return () => {
      clearTimeout(fallback);
      ctx.revert();
    };
  }, []);

  return (
    <div className={`flex justify-center py-8 ${className}`}>
      <svg
        width="120"
        height="24"
        viewBox="0 0 120 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          ref={pathRef}
          d="M0 12 Q30 0 60 12 Q90 24 120 12"
          stroke="url(#divider-gradient)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="divider-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
            <stop offset="50%" stopColor="#059669" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
