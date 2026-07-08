"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

gsap.registerPlugin(ScrollTrigger);

// Tech stack for marquee rows
const techRow1 = [
  { name: "React", color: "#61dafb" },
  { name: "Next.js", color: "#ffffff" },
  { name: "TypeScript", color: "#3178c6" },
  { name: "Node.js", color: "#68a063" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "MongoDB", color: "#47a248" },
  { name: "Tailwind CSS", color: "#38bdf8" },
  { name: "GraphQL", color: "#e535ab" },
  { name: "Docker", color: "#2496ed" },
];

const techRow2 = [
  { name: "Express.js", color: "#888" },
  { name: "Prisma", color: "#5a67d8" },
  { name: "Redis", color: "#dc382d" },
  { name: "Git", color: "#f05032" },
  { name: "AWS", color: "#ff9900" },
  { name: "Python", color: "#3776ab" },
  { name: "Framer Motion", color: "#bb4bf8" },
  { name: "GSAP", color: "#88ce02" },
  { name: "Three.js", color: "#ffffff" },
];

// Proficiency categories
const proficiency = [
  { label: "Frontend Development", pct: 90, color: "from-emerald to-teal" },
  { label: "Backend Development", pct: 80, color: "from-teal to-cyan" },
  { label: "Database Design", pct: 75, color: "from-cyan to-emerald" },
  { label: "DevOps & Cloud", pct: 60, color: "from-emerald to-violet-soft" },
];

function TechPill({ name, color }: { name: string; color: string }) {
  return (
    <span className="inline-flex cursor-default items-center gap-2 whitespace-nowrap rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:text-white">
      <span
        className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
      />
      {name}
    </span>
  );
}

function MarqueeRow({ items, reverse = false }: { items: typeof techRow1; reverse?: boolean }) {
  return (
    <div className="overflow-hidden py-2">
      <div
        className={`flex gap-3 ${reverse ? "marquee-track-reverse" : "marquee-track"}`}
        aria-hidden="true"
      >
        {/* Duplicate for seamless loop */}
        {[...items, ...items].map((item, i) => (
          <TechPill key={i} name={item.name} color={item.color} />
        ))}
      </div>
    </div>
  );
}

function ProficiencyBar({
  label,
  pct,
  color,
  index,
}: {
  label: string;
  pct: number;
  color: string;
  index: number;
}) {
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

export function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={sectionRef} id="skills" className="relative overflow-hidden px-6 py-32">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="from-teal/5 via-emerald/5 absolute right-0 top-1/3 h-80 w-80 translate-x-1/2 rounded-full bg-gradient-to-l to-transparent blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
              Technology Stack
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Technical <span className="text-gradient">Skills</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
              A curated set of technologies I use to build scalable, high-performance applications
            </p>
          </div>
        </ScrollReveal>

        {/* Tech marquee belt */}
        <ScrollReveal delay={0.2}>
          <div className="mt-20 space-y-3">
            <MarqueeRow items={techRow1} />
            <MarqueeRow items={techRow2} reverse />
          </div>
        </ScrollReveal>

        {/* Proficiency bars */}
        <ScrollReveal delay={0.3}>
          <div className="mt-20">
            <p className="text-muted-foreground mb-8 text-center text-xs font-medium uppercase tracking-[0.3em]">
              Area Proficiency
            </p>
            <div className="mx-auto max-w-2xl space-y-6">
              {proficiency.map((item, i) => (
                <ProficiencyBar key={item.label} {...item} index={i} />
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Skill categories (text list — typographic layout) */}
        <ScrollReveal delay={0.4}>
          <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Frontend",
                skills: [
                  "React",
                  "Next.js",
                  "TypeScript",
                  "Tailwind CSS",
                  "Redux",
                  "Framer Motion",
                ],
              },
              {
                name: "Backend",
                skills: ["Node.js", "Express.js", "Python", "Java", "REST APIs", "GraphQL"],
              },
              {
                name: "Database",
                skills: ["PostgreSQL", "MongoDB", "Prisma", "Mongoose", "Redis"],
              },
              {
                name: "Tools & Infra",
                skills: ["Git", "Docker", "Linux", "CI/CD", "AWS", "Nginx"],
              },
            ].map((category) => (
              <div key={category.name} className="group">
                <div className="mb-4 flex items-center gap-3">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/30 transition-colors duration-300 group-hover:text-white/50">
                    {category.name}
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/[0.07] to-transparent" />
                </div>
                <ul className="space-y-2">
                  {category.skills.map((skill) => (
                    <li
                      key={skill}
                      className="flex cursor-default items-center gap-2 text-sm text-white/50 transition-all duration-200 hover:text-white/90"
                    >
                      <span className="bg-emerald/50 h-1 w-1 flex-shrink-0 rounded-full" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
