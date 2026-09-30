"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface WordRevealTextProps {
  children: string;
  className?: string;
}

function isReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function WordRevealText({ children, className }: WordRevealTextProps) {
  const pRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const p = pRef.current;
    if (!p) return;
    // Reduced-motion: leave the declaratively-rendered words fully visible.
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        p.querySelectorAll("[data-word]"),
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.025,
          duration: 0.55,
          ease: "power3.out",
          scrollTrigger: {
            trigger: p,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, p);
    return () => ctx.revert();
  }, [children]);

  const words = children.split(" ");

  return (
    <p ref={pRef} className={`reveal-text leading-relaxed ${className ?? ""}`}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span data-word className="inline-block will-change-transform">
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}
