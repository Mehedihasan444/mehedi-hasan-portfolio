"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

function renderLine(line: string, i: number) {
  if (line.startsWith("### ")) {
    return (
      <h3 key={i} className="content-reveal mt-8 text-xl font-semibold text-white">
        {line.replace("### ", "")}
      </h3>
    );
  }
  if (line.startsWith("## ")) {
    return (
      <h2 key={i} className="content-reveal mt-10 text-2xl font-bold text-white">
        {line.replace("## ", "")}
      </h2>
    );
  }
  if (line.startsWith("- **")) {
    const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
    if (match?.[1] && match?.[2]) {
      return (
        <div key={i} className="content-reveal flex gap-3">
          <span
            aria-hidden="true"
            className="bg-emerald mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
          />
          <div>
            <strong className="text-white">{match[1]}:</strong>{" "}
            <span className="text-muted-foreground">{match[2]}</span>
          </div>
        </div>
      );
    }
    return (
      <div key={i} className="content-reveal flex gap-3">
        <span
          aria-hidden="true"
          className="bg-emerald mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
        />
        <p className="text-muted-foreground">{line.replace(/^- \*\*|\*\*$/g, "")}</p>
      </div>
    );
  }
  if (line.startsWith("- ")) {
    return (
      <div key={i} className="content-reveal flex gap-3">
        <span
          aria-hidden="true"
          className="bg-emerald mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
        />
        <p className="text-muted-foreground">{line.replace("- ", "")}</p>
      </div>
    );
  }
  if (line.trim() === "") {
    return <div key={i} aria-hidden="true" className="h-2" />;
  }
  return (
    <p key={i} className="content-reveal text-muted-foreground leading-relaxed">
      {line}
    </p>
  );
}

export function BlogContent({ content }: { content: string }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia?.("(pointer: coarse)").matches) return;
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      const els = contentRef.current?.querySelectorAll(".content-reveal");
      if (els && els.length > 0) {
        gsap.fromTo(
          els,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: "power3.out",
            overwrite: true,
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
              once: true,
            },
          },
        );
      }
    }, contentRef);
    return () => ctx.revert();
  }, []);

  if (!content || !content.trim()) {
    return (
      <section className="relative py-16">
        <p className="text-muted-foreground text-sm">No content yet.</p>
      </section>
    );
  }

  return (
    <section className="relative py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="from-emerald/5 via-teal/5 absolute right-0 top-1/2 h-72 w-72 rounded-full bg-gradient-to-bl to-transparent blur-[100px]" />
      </div>
      <div ref={contentRef} className="relative space-y-6">
        {content.split("\n").map((line, i) => renderLine(line, i))}
      </div>
    </section>
  );
}
