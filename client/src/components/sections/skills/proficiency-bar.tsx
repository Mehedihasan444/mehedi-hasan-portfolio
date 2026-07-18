"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ProficiencyProps {
  label: string;
  pct: number;
  color: string;
  index: number;
}

export function ProficiencyBar({ label, pct, color, index }: ProficiencyProps) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!barRef.current) return;
      gsap.fromTo(
        barRef.current,
        { width: "0%" },
        {
          width: `${pct}%`,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: barRef.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
          delay: index * 0.12,
        },
      );
    });
    return () => ctx.revert();
  }, [pct, index]);

  return (
    <div className="group">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-white/70 transition-colors duration-300 group-hover:text-white">
          {label}
        </span>
        <span className="text-muted-foreground font-mono text-xs">{pct}%</span>
      </div>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          ref={barRef}
          className={`h-full rounded-full bg-gradient-to-r ${color} shadow-lg`}
          style={{ width: 0 }}
        />
      </div>
    </div>
  );
}
