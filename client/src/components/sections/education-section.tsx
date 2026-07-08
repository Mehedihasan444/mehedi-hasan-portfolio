"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { SvgDivider } from "@/components/animations/svg-divider";
import { GraduationCap, CalendarDays, MapPin, BookOpen } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const education = [
  {
    degree: "Bachelor of Science in Computer Science & Engineering",
    institution: "University of Information Technology & Sciences",
    period: "2022 – 2026",
    location: "Dhaka, Bangladesh",
    description:
      "Focusing on software engineering, algorithms, data structures, and modern web technologies. Engaged in research projects and competitive programming throughout the program.",
    tags: ["Computer Science", "Software Engineering", "Algorithms", "Data Structures", "Web Dev"],
    gpa: "On Track",
    current: true,
  },
];

export function EducationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".edu-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.2,
            duration: 0.8,
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
    <section ref={sectionRef} id="education" className="relative overflow-hidden px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
              Learning
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="text-gradient">Education</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="mx-auto mt-16 max-w-4xl">
          {education.map((edu, i) => (
            <div key={i} className="edu-card">
              <div className="glass group relative rounded-2xl p-8 transition-all duration-500 hover:border-white/20">
                <div className="from-emerald/5 via-teal/5 absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  {/* Header row */}
                  <div className="flex flex-wrap items-start gap-4 sm:flex-nowrap">
                    {/* Icon */}
                    <div className="from-emerald/20 to-teal/10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-105">
                      <GraduationCap className="text-emerald h-7 w-7" />
                    </div>

                    {/* Degree & institution */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                        {edu.current && (
                          <span className="bg-teal/10 text-teal flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="bg-teal/70 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                              <span className="bg-teal relative inline-flex h-1.5 w-1.5 rounded-full" />
                            </span>
                            Ongoing
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-1 font-medium">{edu.institution}</p>
                    </div>

                    {/* Period badge */}
                    <span className="bg-emerald/10 text-emerald flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                      <CalendarDays size={10} />
                      {edu.period}
                    </span>
                  </div>

                  {/* Meta row */}
                  <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} />
                      {edu.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={12} />
                      GPA: {edu.gpa}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mt-5 leading-relaxed">{edu.description}</p>

                  {/* Tags */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {edu.tags.map((tag) => (
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
      <SvgDivider />
    </section>
  );
}
