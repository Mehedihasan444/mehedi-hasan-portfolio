"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { CalendarDays, Briefcase, MapPin } from "lucide-react";
import type { FormattedExperience } from "@/lib/api-public";

function formatPeriod(startDate: string, endDate: string | null): string {
  const start = new Date(startDate).getFullYear();
  const end = endDate ? new Date(endDate).getFullYear() : "Present";
  return `${start} – ${end}`;
}

export function TimelineCard({ exp, index }: { exp: FormattedExperience; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!cardRef.current) return;

      gsap.fromTo(
        cardRef.current,
        { opacity: 0, x: index % 2 === 0 ? -60 : 60, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        },
      );

      const dot = cardRef.current.querySelector(".timeline-dot");
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
              trigger: cardRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          },
        );
      }
    }, cardRef);
    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`relative mb-12 pl-16 md:w-1/2 md:pl-0 ${
        index % 2 === 0 ? "md:pr-16 md:text-right" : "md:ml-auto md:pl-16"
      }`}
    >
      <div
        className={`timeline-dot absolute left-8 top-4 ${
          index % 2 === 0 ? "md:left-auto md:right-[-7px]" : "md:left-[-7px] md:right-auto"
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

      <div className="glass group relative rounded-xl p-6 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/20">
        <div className="from-emerald/5 via-teal/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10">
          <div
            className={`flex flex-wrap items-center gap-2 ${index % 2 === 0 ? "md:justify-end" : ""}`}
          >
            <span className="bg-emerald/10 text-emerald inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
              <CalendarDays size={10} />
              {formatPeriod(exp.startDate, exp.endDate)}
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
              index % 2 === 0 ? "md:justify-end" : ""
            }`}
          >
            <span className="flex items-center gap-1">
              <Briefcase size={11} />
              {exp.company}
            </span>
            {exp.location && (
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                {exp.location}
              </span>
            )}
          </div>

          <p
            className={`text-muted-foreground mt-3 text-sm leading-relaxed ${
              index % 2 === 0 ? "md:text-right" : ""
            }`}
          >
            {exp.description}
          </p>

          {exp.tags.length > 0 && (
            <div className={`mt-4 flex flex-wrap gap-2 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
              {exp.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-muted-foreground rounded-full bg-white/5 px-3 py-1 text-xs transition-colors hover:bg-white/10 hover:text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
