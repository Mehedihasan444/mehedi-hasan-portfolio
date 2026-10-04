"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
// Real GitHub figures, snapshot from the REST API on 2026-09-30 (see ./constants.ts).
import { languages, type GHLang } from "./constants";

function Bar({ lang, index }: { lang: GHLang; index: number }) {
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
    <div
      className="flex min-w-0 flex-1 flex-col items-center gap-2"
      style={{ transformOrigin: "bottom" }}
    >
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
      <span className="text-muted-foreground max-w-full truncate text-center text-[9px] leading-tight">
        {lang.name}
      </span>
    </div>
  );
}

export function LanguageBreakdown() {
  return (
    <ScrollReveal direction="left" delay={0.2} className="min-w-0">
      <div className="glass group relative min-w-0 overflow-hidden rounded-xl p-4 transition-all duration-500 hover:border-white/20 sm:p-6">
        <div className="from-emerald/5 via-teal/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10 min-w-0">
          <h3 className="font-medium text-white">Language Breakdown</h3>
          <p className="mt-1 text-xs text-white/40">
            Share of public repositories by primary language
          </p>
          <div className="mt-6 flex min-w-0 items-end gap-1 sm:gap-2" style={{ height: 120 }}>
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
