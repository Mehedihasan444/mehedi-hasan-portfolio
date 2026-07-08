"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TimelineStep {
  target: string | Element;
  vars: gsap.TweenVars;
  position?: string | number;
}

interface UseScrollDrivenTimelineOptions {
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: number | boolean;
  pin?: boolean | string;
  markers?: boolean;
  toggleActions?: string;
}

export function useScrollDrivenTimeline<T extends HTMLElement>(
  steps: TimelineStep[],
  options: UseScrollDrivenTimelineOptions = {},
) {
  const ref = useRef<T>(null);
  const {
    start = "top top",
    end = "bottom top",
    scrub = 2,
    pin = false,
    markers = false,
    toggleActions,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: options.trigger || el,
          start,
          end,
          scrub,
          pin,
          markers,
          ...(toggleActions ? { toggleActions } : {}),
        },
        defaults: { ease: "none" },
      });

      steps.forEach((step) => {
        tl.to(step.target, step.vars, step.position);
      });
    }, el);

    return () => ctx.revert();
  }, [steps, start, end, scrub, pin, markers, toggleActions, options.trigger]);

  return ref;
}
