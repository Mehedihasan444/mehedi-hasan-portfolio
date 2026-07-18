"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface UseParallaxOptions {
  speed?: number;
  direction?: "vertical" | "horizontal";
  scrub?: number;
}

export function useParallax<T extends HTMLElement>(options: UseParallaxOptions = {}) {
  const ref = useRef<T>(null);
  const { speed = 0.5, direction = "vertical", scrub = 1 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const prop = direction === "vertical" ? "y" : "x";

      gsap.fromTo(
        el,
        { [prop]: `-${speed * 50}%` },
        {
          [prop]: `${speed * 50}%`,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [speed, direction, scrub]);

  return ref;
}
