"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TimelineItem {
  period: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  isCurrent?: boolean;
}

interface RadialOrbitalTimelineProps {
  items: TimelineItem[];
  className?: string;
}

function TimelineCard({ item }: { item: TimelineItem }) {
  return (
    <div className="glass group relative rounded-xl p-6 transition-all duration-500 hover:border-white/20">
      <div className="from-emerald/5 via-teal/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-emerald/10 text-emerald inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
            {item.period}
          </span>
          {item.isCurrent && (
            <span className="bg-teal/10 text-teal rounded-full px-3 py-1 text-xs">Current</span>
          )}
        </div>
        <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
        <p className="text-muted-foreground text-sm">{item.subtitle}</p>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{item.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
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
  );
}

function TimelineDot({ isCurrent, index }: { isCurrent?: boolean; index: number }) {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`border-emerald bg-background shadow-emerald/20 relative z-10 h-4 w-4 rounded-full border-2 shadow-lg ${
          isCurrent
            ? "animate-glow ring-emerald/30 ring-offset-background ring-2 ring-offset-2"
            : ""
        }`}
      >
        <div className="from-emerald to-teal absolute inset-0.5 rounded-full bg-gradient-to-br" />
      </div>
      <div
        className="from-emerald/30 to-teal/30 absolute h-8 w-8 rounded-full bg-gradient-to-br blur-sm"
        style={{
          animation: `orbitPulse ${2 + index * 0.5}s ease-in-out infinite alternate`,
        }}
      />
    </div>
  );
}

export function RadialOrbitalTimeline({ items, className = "" }: RadialOrbitalTimelineProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardRowsRef = useRef<HTMLDivElement[]>([]);

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

      cardRowsRef.current.forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className={`relative overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-0">
        <div className="from-emerald/5 via-teal/5 absolute left-1/3 top-1/4 h-72 w-72 rounded-full bg-gradient-to-br to-transparent blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="relative">
          <div
            ref={lineRef}
            className="from-emerald via-teal absolute left-[19px] top-0 h-full w-0.5 origin-top bg-gradient-to-b to-transparent md:left-1/2 md:-translate-x-1/2"
            style={{ transform: "scaleY(0)" }}
          />

          <div className="relative space-y-12 md:space-y-16">
            {items.map((item, i) => (
              <div key={i} className="relative md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8">
                {/* Desktop: left card */}
                <div
                  ref={(el) => {
                    if (el) cardRowsRef.current[i] = el;
                  }}
                  className={`hidden md:flex md:items-center ${i % 2 === 0 ? "md:justify-end" : "md:order-3"}`}
                >
                  {i % 2 === 0 && (
                    <div className="w-full max-w-lg">
                      <TimelineCard item={item} />
                    </div>
                  )}
                </div>

                {/* Dot column */}
                <div className="flex items-start justify-center md:order-2">
                  <div className="relative flex flex-col items-center pt-2">
                    <TimelineDot isCurrent={item.isCurrent} index={i} />
                  </div>
                </div>

                {/* Desktop: right card */}
                <div
                  className={`hidden md:flex md:items-center ${i % 2 !== 0 ? "md:order-1 md:justify-end" : "md:order-3"}`}
                >
                  {i % 2 !== 0 && (
                    <div className="w-full max-w-lg">
                      <TimelineCard item={item} />
                    </div>
                  )}
                </div>

                {/* Mobile: full-width card */}
                <div className="-mt-6 pl-10 md:hidden">
                  <TimelineCard item={item} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes orbitPulse {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.5);
            opacity: 0.2;
          }
        }
      `}</style>
    </section>
  );
}
