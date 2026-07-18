"use client";

import { useEffect, useRef, useState } from "react";
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
  const [count, setCount] = useState(options.start ?? 0);
  const {
    end,
    start = 0,
    duration = 2,
    prefix = "",
    suffix = "",
    decimals = 0,
    disableScrollTrigger = false,
  } = options;

  const isInView = useInView(ref as React.RefObject<Element>, {
    once: true,
    margin: "-50px",
  });

  const shouldAnimate = disableScrollTrigger || isInView;

  useEffect(() => {
    if (!shouldAnimate) return;

    const startTime = performance.now();
    const range = end - start;

    const raf = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setCount(start + range * ease);
      if (t < 1) requestAnimationFrame(raf);
    };

    const id = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(id);
  }, [shouldAnimate, end, start, duration]);

  const display = `${prefix}${count.toFixed(decimals)}${suffix}`;

  return { ref, count, display };
}
