"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { GitFork, Star, GitPullRequest, Users } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const languages = [
  { name: "TypeScript", percentage: 45, color: "#3178c6" },
  { name: "JavaScript", percentage: 25, color: "#f7df1e" },
  { name: "HTML/CSS", percentage: 15, color: "#f16529" },
  { name: "Python", percentage: 10, color: "#3776ab" },
  { name: "Other", percentage: 5, color: "#6b7280" },
];

const ghStats = [
  { icon: Star, label: "Stars Earned", value: "20+" },
  { icon: GitFork, label: "Repos Forked", value: "15+" },
  { icon: GitPullRequest, label: "Pull Requests", value: "30+" },
  { icon: Users, label: "Followers", value: "25+" },
];

// Contribution heatmap — 24 weeks × 7 days, intensity 0–4
function ContributionHeatmap() {
  const weeks = 24;
  const days = 7;
  // Simple seeded pseudo-random for stable SSR/CSR match
  const seed = (w: number, d: number) => {
    const n = Math.sin(w * 37 + d * 13) * 43758.5453;
    return Math.abs(n - Math.floor(n));
  };
  const intensity = (v: number) => {
    if (v < 0.4) return "bg-white/[0.04]";
    if (v < 0.6) return "bg-emerald/20";
    if (v < 0.75) return "bg-emerald/40";
    if (v < 0.88) return "bg-emerald/65";
    return "bg-emerald";
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max gap-1" aria-label="GitHub contribution heatmap" role="img">
        {Array.from({ length: weeks }).map((_, w) => (
          <div key={w} className="flex flex-col gap-1">
            {Array.from({ length: days }).map((_, d) => {
              const v = seed(w, d);
              return (
                <div
                  key={d}
                  title={`${Math.round(v * 8)} contributions`}
                  className={`h-3 w-3 rounded-sm ${intensity(v)} cursor-default transition-all duration-200 hover:scale-125`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function GitHubSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const bars = sectionRef.current?.querySelectorAll(".gh-bar");
      if (bars) {
        gsap.fromTo(
          bars,
          { scaleY: 0 },
          {
            scaleY: 1,
            stagger: 0.06,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="github" className="relative overflow-hidden px-6 py-24">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="from-emerald/5 absolute right-1/4 top-1/2 h-80 w-80 -translate-y-1/2 translate-x-1/2 rounded-full bg-gradient-to-l to-transparent blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
              Open Source
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              GitHub <span className="text-gradient">Statistics</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
              My open source contributions and coding activity across various projects
            </p>
          </div>
        </ScrollReveal>

        {/* Stats row */}
        <ScrollReveal delay={0.1}>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {ghStats.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="glass group relative rounded-xl p-5 text-center transition-all duration-500 hover:-translate-y-0.5 hover:border-white/20"
              >
                <div className="from-emerald/5 via-teal/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <Icon className="text-emerald mx-auto mb-2 h-5 w-5" />
                  <div className="font-heading text-gradient text-2xl font-bold">{value}</div>
                  <div className="text-muted-foreground mt-1 text-xs">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Language breakdown */}
          <ScrollReveal direction="left" delay={0.2}>
            <div className="glass group relative rounded-xl p-6 transition-all duration-500 hover:border-white/20">
              <div className="from-emerald/5 via-teal/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative z-10">
                <h3 className="font-medium text-white">Language Breakdown</h3>
                {/* Bar chart */}
                <div className="mt-6 flex items-end gap-2" style={{ height: 120 }}>
                  {languages.map((lang) => (
                    <div
                      key={lang.name}
                      className="gh-bar flex flex-1 flex-col items-center gap-2"
                      style={{ transformOrigin: "bottom" }}
                    >
                      <span className="text-[10px] text-white/50">{lang.percentage}%</span>
                      <div
                        className="w-full rounded-t transition-all duration-300 hover:brightness-125"
                        style={{
                          height: `${lang.percentage * 1.4}px`,
                          minHeight: 4,
                          backgroundColor: lang.color,
                          boxShadow: `0 0 8px ${lang.color}40`,
                        }}
                        title={lang.name}
                      />
                      <span className="text-muted-foreground text-center text-[9px] leading-tight">
                        {lang.name}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Legend */}
                <div className="mt-4 flex flex-wrap gap-3">
                  {languages.map((l) => (
                    <div
                      key={l.name}
                      className="text-muted-foreground flex items-center gap-1.5 text-xs"
                    >
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

          {/* Contribution heatmap */}
          <ScrollReveal direction="right" delay={0.3}>
            <div className="glass group relative rounded-xl p-6 transition-all duration-500 hover:border-white/20">
              <div className="from-teal/5 via-emerald/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium text-white">Contribution Activity</h3>
                  <span className="text-muted-foreground text-xs">Last 6 months</span>
                </div>
                <ContributionHeatmap />
                <div className="text-muted-foreground mt-4 flex items-center gap-2 text-xs">
                  <span>Less</span>
                  <div className="flex gap-1">
                    {[
                      "bg-white/[0.04]",
                      "bg-emerald/20",
                      "bg-emerald/40",
                      "bg-emerald/65",
                      "bg-emerald",
                    ].map((c) => (
                      <div key={c} className={`h-3 w-3 rounded-sm ${c}`} />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* CTA */}
        <ScrollReveal delay={0.4}>
          <div className="mt-8 text-center">
            <Link
              href="https://github.com/Mehedihasan444"
              target="_blank"
              rel="noopener noreferrer"
              className="from-emerald to-teal hover:shadow-emerald/25 group inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View GitHub Profile
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
