"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "@/lib/gsap";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({
      lerp: 0.09,
      easing: (t) => Math.min(1, 1 - Math.pow(1 - t, 3)),
      wheelMultiplier: 1,
      gestureOrientation: "vertical",
      infinite: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    let rafId = 0;
    let running = true;

    const raf = (time: number) => {
      if (!running) return;
      if (!document.hidden) lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
