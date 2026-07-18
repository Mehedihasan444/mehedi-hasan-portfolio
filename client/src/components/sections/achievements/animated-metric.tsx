"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Code2, GitBranch, Coffee, type LucideIcon } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Code2,
  GitBranch,
  Coffee,
};

interface MetricProps {
  value: string;
  label: string;
  icon: string;
  gradient: string;
  index: number;
}

export function AnimatedMetric({ value, label, icon, gradient, index }: MetricProps) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = iconMap[icon];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { opacity: 0, scale: 0.8, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          ease: "back.out(1.5)",
          delay: index * 0.1,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={ref} className="group relative">
      <div className="glass relative overflow-hidden rounded-2xl p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:border-white/20">
        <div
          className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-[0.06]`}
        />
        <div className="relative z-10">
          <div className="${gradient} mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-opacity-10 bg-gradient-to-br">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="font-heading text-gradient text-4xl font-bold">{value}</div>
          <div className="text-muted-foreground mt-1 text-sm">{label}</div>
        </div>
      </div>
    </div>
  );
}
