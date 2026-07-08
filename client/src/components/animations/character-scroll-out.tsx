"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CharacterScrollOutProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function CharacterScrollOut({
  children,
  className = "",
  ariaLabel,
}: CharacterScrollOutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars = container.querySelectorAll<HTMLElement>(".scroll-char");
    if (chars.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { y: 0, opacity: 1, scaleY: 1 },
        {
          y: 200,
          opacity: 0,
          scaleY: 0.3,
          stagger: 0.02,
          ease: "power2.in",
          scrollTrigger: {
            trigger: container.closest("section") || container,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
          force3D: true,
        },
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={className} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
