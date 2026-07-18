"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

gsap.registerPlugin(ScrollTrigger);

function renderLine(line: string, i: number) {
  if (line.startsWith("## ")) {
    return (
      <h2 key={i} className="content-reveal mt-10 text-2xl font-bold text-white">
        {line.replace("## ", "")}
      </h2>
    );
  }
  if (line.startsWith("### ")) {
    return (
      <h3 key={i} className="content-reveal mt-8 text-xl font-semibold text-white">
        {line.replace("### ", "")}
      </h3>
    );
  }
  if (line.startsWith("- **")) {
    const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
    if (match) {
      return (
        <div key={i} className="content-reveal flex gap-3">
          <span className="bg-emerald mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
          <div>
            <strong className="text-white">{match[1]}:</strong>{" "}
            <span className="text-muted-foreground">{match[2]}</span>
          </div>
        </div>
      );
    }
    return (
      <div key={i} className="content-reveal flex gap-3">
        <span className="bg-emerald mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
        <p className="text-muted-foreground">{line.replace(/^- \*\*|\*\*$/g, "")}</p>
      </div>
    );
  }
  if (line.startsWith("- ")) {
    return (
      <div key={i} className="content-reveal flex gap-3">
        <span className="bg-emerald mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
        <p className="text-muted-foreground">{line.replace("- ", "")}</p>
      </div>
    );
  }
  if (line.trim() === "") {
    return <div key={i} className="h-2" />;
  }
  return (
    <p key={i} className="content-reveal text-muted-foreground leading-relaxed">
      {line}
    </p>
  );
}

export function ProjectMarkdown({ content }: { content: string }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const contentEls = contentRef.current?.querySelectorAll(".content-reveal");
      if (contentEls) {
        gsap.fromTo(
          contentEls,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, contentRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative px-6 py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="from-emerald/5 via-teal/5 absolute left-1/4 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-br to-transparent blur-[120px]" />
      </div>
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <h2 className="text-gradient mb-12 text-2xl font-bold">About This Project</h2>
        </ScrollReveal>
        <div ref={contentRef} className="prose prose-invert prose-emerald max-w-none space-y-6">
          {content.split("\n").map((line, i) => renderLine(line, i))}
        </div>
      </div>
    </section>
  );
}
