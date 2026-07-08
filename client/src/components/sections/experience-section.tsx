"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Briefcase, MapPin, CalendarDays } from "lucide-react";
import { ElegantShape } from "@/components/ui/shape-landing-hero";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    period: "2024 – Present",
    role: "Full Stack Developer",
    company: "Freelance / Self-Employed",
    location: "Remote",
    description:
      "Building scalable web applications for clients using React, Next.js, Node.js, and modern technologies. Delivering end-to-end solutions from conception to deployment with focus on performance and user experience.",
    tags: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL"],
    current: true,
  },
  {
    period: "2023 – 2024",
    role: "Junior Full Stack Developer",
    company: "Freelance",
    location: "Remote",
    description:
      "Developed full-stack web applications including e-commerce platforms, content management systems, and RESTful APIs. Collaborated with clients to gather requirements and deliver solutions on time.",
    tags: ["React", "Node.js", "Express", "MongoDB", "JavaScript"],
    current: false,
  },
  {
    period: "2022 – 2023",
    role: "Frontend Developer Intern",
    company: "Freelance / Personal Projects",
    location: "Remote",
    description:
      "Started journey in web development by building responsive websites and learning modern JavaScript frameworks. Contributed to open-source projects and built a strong foundation in web technologies.",
    tags: ["HTML/CSS", "JavaScript", "React", "Git", "Responsive Design"],
    current: false,
  },
];

export function ExperienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1.5,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "bottom 40%",
              scrub: 1,
            },
          },
        );
      }

      cardsRef.current.filter(Boolean).forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: i % 2 === 0 ? -60 : 60, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          },
        );

        const dot = card.querySelector(".timeline-dot");
        if (dot) {
          gsap.fromTo(
            dot,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: card,
                start: "top 82%",
                toggleActions: "play none none none",
              },
            },
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="bg-background relative overflow-hidden px-6 py-32"
    >
      {/* Top gradient divider */}
      <div
        className="via-emerald/30 pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent to-transparent"
        aria-hidden
      />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="from-emerald/5 absolute left-1/3 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-gradient-to-r to-transparent blur-[120px]" />
      </div>

      {/* Floating shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.2}
          width={400}
          height={100}
          rotate={10}
          gradient="from-emerald/[0.2]"
          className="left-[-6%] top-[8%] -z-10"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-15}
          gradient="from-teal/[0.15]"
          className="right-[-4%] top-[60%]"
        />

        <ElegantShape
          delay={0.3}
          width={200}
          height={55}
          rotate={-8}
          gradient="from-cyan/[0.15]"
          className="bottom-[10%] left-[10%]"
        />
      </div>

      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
              Career
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Work <span className="text-gradient">Experience</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
              My professional journey building impactful products and growing as an engineer
            </p>
          </div>
        </ScrollReveal>

        <div className="relative mt-20">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 h-full w-0.5 overflow-hidden md:left-1/2 md:-translate-x-0.5">
            <div
              ref={lineRef}
              className="h-full w-full origin-top"
              style={{
                background: "linear-gradient(to bottom, #059669, #06b6d4, transparent)",
                transform: "scaleY(0)",
              }}
            />
          </div>

          {experiences.map((exp, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              className={`relative mb-12 pl-16 md:w-1/2 md:pl-0 ${
                i % 2 === 0 ? "md:pr-16 md:text-right" : "md:ml-auto md:pl-16"
              }`}
            >
              {/* Timeline dot */}
              <div
                className={`timeline-dot absolute left-8 top-4 ${
                  i % 2 === 0 ? "md:left-auto md:right-[-7px]" : "md:left-[-7px] md:right-auto"
                }`}
              >
                <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                  {exp.current && (
                    <span className="animate-ping-slow bg-emerald/50 absolute inline-flex h-full w-full rounded-full" />
                  )}
                  <span
                    className={`relative inline-flex h-3.5 w-3.5 rounded-full border-2 ${
                      exp.current
                        ? "border-emerald bg-emerald/30 shadow-emerald/30 shadow-lg"
                        : "bg-background border-white/20"
                    }`}
                  />
                </div>
              </div>

              {/* Card */}
              <div className="glass group relative rounded-xl p-6 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/20">
                <div className="from-emerald/5 via-teal/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  {/* Header */}
                  <div
                    className={`flex flex-wrap items-center gap-2 ${i % 2 === 0 ? "md:justify-end" : ""}`}
                  >
                    <span className="bg-emerald/10 text-emerald inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                      <CalendarDays size={10} />
                      {exp.period}
                    </span>
                    {exp.current && (
                      <span className="bg-teal/10 text-teal rounded-full px-3 py-1 text-xs font-medium">
                        Current
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-lg font-semibold text-white">{exp.role}</h3>

                  <div
                    className={`text-muted-foreground mt-1 flex flex-wrap items-center gap-3 text-xs ${
                      i % 2 === 0 ? "md:justify-end" : ""
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Briefcase size={11} />
                      {exp.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {exp.location}
                    </span>
                  </div>

                  <p
                    className={`text-muted-foreground mt-3 text-sm leading-relaxed ${
                      i % 2 === 0 ? "md:text-right" : ""
                    }`}
                  >
                    {exp.description}
                  </p>

                  {/* Tags */}
                  <div
                    className={`mt-4 flex flex-wrap gap-2 ${i % 2 === 0 ? "md:justify-end" : ""}`}
                  >
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-muted-foreground rounded-full bg-white/5 px-3 py-1 text-xs transition-colors hover:bg-white/10 hover:text-white"
                      >
                        {tag}
                      </span>
                    ))}
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
