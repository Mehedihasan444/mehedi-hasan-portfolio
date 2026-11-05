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

    // Lenis measures its scroll limit from <html>, which is `h-full` (fixed
    // to the viewport height), so its internal ResizeObserver never sees
    // content growth from streamed Suspense sections or lazy images. The
    // limit then freezes at the initial page height and every wheel past it
    // gets clamped back — the page feels stuck below Education. <body> does
    // grow, so observe it and remeasure both Lenis and ScrollTrigger.
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const bodyRo = new ResizeObserver(() => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      }, 150);
    });
    bodyRo.observe(document.body);

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
      if (resizeTimer) clearTimeout(resizeTimer);
      bodyRo.disconnect();
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
