"use client";

import { useState, useEffect, useRef } from "react";

interface ScrollProgress {
  progress: number;
  scrollY: number;
  direction: "up" | "down";
}

export function useScrollProgress(): ScrollProgress {
  const [state, setState] = useState<ScrollProgress>({
    progress: 0,
    scrollY: 0,
    direction: "down",
  });
  const prevScrollY = useRef(0);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? scrollY / max : 0;

        setState({
          progress: Math.min(1, Math.max(0, progress)),
          scrollY,
          direction: scrollY > prevScrollY.current ? "down" : "up",
        });
        prevScrollY.current = scrollY;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return state;
}
