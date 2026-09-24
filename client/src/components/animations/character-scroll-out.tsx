"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Skip animation: leave text fully visible (final state).
      return;
    }

    const chars = container.querySelectorAll<HTMLElement>(".scroll-char");
    if (chars.length === 0) return;

    // Initial state is visible in CSS; explicitly set it via GSAP and
    // animate from it, so a GSAP/ScrollTrigger failure can never leave
    // text invisible. Cleanup reverts to the visible state.
    gsap.set(chars, { opacity: 1, y: 0 });

    const ctx = gsap.context(() => {
      gsap.to(chars, {
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
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className={className} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
