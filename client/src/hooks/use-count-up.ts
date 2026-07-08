"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseCountUpOptions {
  end: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  scrollTrigger?: boolean;
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
    scrollTrigger = true,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obj = { val: start };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        ...(scrollTrigger
          ? {
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          : {}),
      });

      tl.to(obj, {
        val: end,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          setCount(obj.val);
        },
      });
    }, el);

    return () => ctx.revert();
  }, [end, start, duration, scrollTrigger]);

  const display = `${prefix}${count.toFixed(decimals)}${suffix}`;

  return { ref, count, display };
}
