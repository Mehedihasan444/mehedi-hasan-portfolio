"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

const CELLS = [8, 22, 36, 50, 64, 78, 92];

/**
 * Twin-rail energy conduit: two faint outer rails, a scroll-driven gradient
 * core, an ambient downward light-flow, and evenly spaced pulsing energy
 * cells. Reduced-motion renders the finished core statically with no flow.
 */
export function TimelineLine() {
  const rootRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const core = coreRef.current;
    if (!root || !core) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      core.style.transform = "scaleY(1)";
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        core,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.parentElement,
            start: "top 65%",
            end: "bottom 45%",
            scrub: 1,
          },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative h-full w-full">
      {/* outer rails */}
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-white/10" />
      <div aria-hidden="true" className="absolute inset-y-0 right-0 w-px bg-white/10" />

      {/* ambient downward light-flow between the rails */}
      <div
        aria-hidden="true"
        className="animate-rail-flow absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 opacity-30 motion-reduce:animate-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(52,211,153,0.9) 0 6px, transparent 6px 14px)",
        }}
      />

      {/* scroll-driven energy core */}
      <div
        ref={coreRef}
        className="absolute inset-y-0 left-1/2 w-[3px] origin-top -translate-x-1/2"
        style={{ transform: "scaleY(0)" }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(to bottom, #34d399, #14b8a6 55%, #22d3ee)",
            boxShadow: "0 0 10px rgba(52, 211, 153, 0.65), 0 0 28px rgba(20, 184, 166, 0.3)",
          }}
        />
      </div>

      {/* pulsing energy cells */}
      {CELLS.map((top, i) => (
        <span
          key={top}
          aria-hidden="true"
          className="animate-pulse-slow absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 rounded-[2px] motion-reduce:animate-none"
          style={{
            top: `${top}%`,
            backgroundColor: i % 2 === 0 ? "#34d399" : "#22d3ee",
            boxShadow: `0 0 10px 2px ${i % 2 === 0 ? "rgba(52,211,153,0.55)" : "rgba(34,211,238,0.55)"}`,
            animationDelay: `${i * 0.55}s`,
          }}
        />
      ))}
    </div>
  );
}
