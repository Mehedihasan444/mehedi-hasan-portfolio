"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useInView } from "framer-motion";

interface UseCountUpOptions {
  end: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  disableScrollTrigger?: boolean;
}

export function useCountUp<T extends HTMLElement>(options: UseCountUpOptions) {
  const ref = useRef<T>(null);
  const {
    end,
    start = 0,
    duration = 2,
    prefix = "",
    suffix = "",
    decimals = 0,
    disableScrollTrigger = false,
  } = options;

  const safeEnd = Number.isFinite(end) ? end : 0;
  const safeStart = Number.isFinite(start) ? start : 0;
  const safeDuration = duration > 0 ? duration : 0.01;
  const safeDecimals = Math.min(Math.max(Math.floor(decimals), 0), 10);

  const [count, setCount] = useState(safeStart);

  const isInView = useInView(ref as RefObject<Element>, {
    once: true,
    margin: "-50px",
  });

  const shouldAnimate = disableScrollTrigger || isInView;

  useEffect(() => {
    if (!shouldAnimate) return;
    if (typeof window === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR fallback to final value
      setCount(safeEnd);
      return;
    }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setCount(safeEnd);
      return;
    }

    const startTime = performance.now();
    const range = safeEnd - safeStart;
    let id = 0;
    let cancelled = false;

    const raf = (now: number) => {
      if (cancelled) return;
      const elapsed = (now - startTime) / 1000;
      const t = Math.min(elapsed / safeDuration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setCount(safeStart + range * ease);
      if (t < 1) id = requestAnimationFrame(raf);
    };

    id = requestAnimationFrame(raf);
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [shouldAnimate, safeEnd, safeStart, safeDuration]);

  let display: string;
  try {
    display = `${prefix}${count.toFixed(safeDecimals)}${suffix}`;
  } catch {
    display = `${prefix}${safeEnd}${suffix}`;
  }

  return { ref, count, display };
}
