"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Trophy, GitBranch, BookOpen, Zap, Code2, Coffee, type LucideIcon } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { value: "10+", label: "Projects Shipped", icon: Zap, gradient: "from-emerald to-teal" },
  { value: "100+", label: "Problems Solved", icon: Code2, gradient: "from-teal to-cyan" },
  { value: "5+", label: "Open Source Repos", icon: GitBranch, gradient: "from-cyan to-emerald" },
  { value: "1K+", label: "Cups of Coffee", icon: Coffee, gradient: "from-amber to-rose" },
];

const achievements = [
  {
    Icon: Trophy,
    title: "Problem Solver",
    description:
      "Solved 100+ algorithmic problems across various competitive programming platforms",
    color: "text-amber",
    bg: "bg-amber/10",
  },
  {
    Icon: GitBranch,
    title: "Open Source Contributor",
    description: "Active contributor to open-source projects and developer communities",
    color: "text-emerald",
    bg: "bg-emerald/10",
  },
  {
    Icon: BookOpen,
    title: "Continuous Learner",
    description: "Constantly learning new technologies and best practices in software engineering",
    color: "text-teal",
    bg: "bg-teal/10",
  },
  {
    Icon: Zap,
    title: "Project Excellence",
    description:
      "Delivered multiple end-to-end projects with high quality and performance standards",
    color: "text-cyan",
    bg: "bg-cyan/10",
  },
];

function AnimatedMetric({
  value,
  label,
  icon: Icon,
  gradient,
  index,
}: {
  value: string;
  label: string;
  icon: LucideIcon;
  gradient: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

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
          <div
            className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} bg-opacity-10`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className={`font-heading text-gradient text-4xl font-bold`}>{value}</div>
          <div className="text-muted-foreground mt-1 text-sm">{label}</div>
        </div>
      </div>
    </div>
  );
}

export function AchievementsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll(".achievement-item");
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, x: -30, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            stagger: 0.12,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="achievements" className="relative overflow-hidden px-6 py-24">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="from-emerald/5 via-teal/5 absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r to-transparent blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
              Milestones
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="text-gradient">Achievements</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Big metric counters */}
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {metrics.map((m, i) => (
            <AnimatedMetric key={m.label} {...m} index={i} />
          ))}
        </div>

        {/* Achievement cards */}
        <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
          {achievements.map((item, i) => (
            <div key={i} className="achievement-item group">
              <div className="glass relative h-full rounded-xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/20">
                <div className="from-emerald/5 via-teal/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10 flex gap-4">
                  <div
                    className={`${item.bg} mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <item.Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{item.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
