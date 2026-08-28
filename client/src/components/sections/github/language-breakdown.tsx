"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

const languages = [
  { name: "TypeScript", percentage: 45, color: "#3178c6" },
  { name: "JavaScript", percentage: 25, color: "#f7df1e" },
  { name: "HTML/CSS", percentage: 15, color: "#f16529" },
  { name: "Python", percentage: 10, color: "#3776ab" },
  { name: "Other", percentage: 5, color: "#6b7280" },
];

function Bar({ lang, index }: { lang: (typeof languages)[0]; index: number }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!barRef.current) return;
      gsap.fromTo(
        barRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.7,
          ease: "power3.out",
          delay: index * 0.06,
          scrollTrigger: {
            trigger: barRef.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <div className="flex flex-1 flex-col items-center gap-2" style={{ transformOrigin: "bottom" }}>
      <span className="text-[10px] text-white/50">{lang.percentage}%</span>
      <div
        ref={barRef}
        className="w-full rounded-t transition-all duration-300 hover:brightness-125"
        style={{
          height: `${lang.percentage * 1.4}px`,
          minHeight: 4,
          backgroundColor: lang.color,
          boxShadow: `0 0 8px ${lang.color}40`,
          transformOrigin: "bottom",
          transform: "scaleY(0)",
        }}
        title={lang.name}
      />
      <span className="text-muted-foreground text-center text-[9px] leading-tight">
        {lang.name}
      </span>
    </div>
  );
}

export function LanguageBreakdown() {
  return (
    <ScrollReveal direction="left" delay={0.2}>
      <div className="glass group relative rounded-xl p-6 transition-all duration-500 hover:border-white/20">
        <div className="from-emerald/5 via-teal/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10">
          <h3 className="font-medium text-white">Language Breakdown</h3>
          <div className="mt-6 flex items-end gap-2" style={{ height: 120 }}>
            {languages.map((lang, i) => (
              <Bar key={lang.name} lang={lang} index={i} />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {languages.map((l) => (
              <div key={l.name} className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: l.color }}
                />
                {l.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
