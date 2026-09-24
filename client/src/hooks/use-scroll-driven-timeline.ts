"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

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
  const stepsRef = useRef(steps);
  const {
    start = "top top",
    end = "bottom top",
    scrub = 2,
    pin = false,
    markers = false,
    toggleActions,
  } = options;
  const trigger = options.trigger;

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger || el,
          start,
          end,
          scrub,
          pin,
          markers,
          ...(toggleActions ? { toggleActions } : {}),
        },
        defaults: { ease: "none" },
      });

      stepsRef.current.forEach((step) => {
        tl.to(step.target, step.vars, step.position);
      });
    }, el);

    return () => ctx.revert();
  }, [start, end, scrub, pin, markers, toggleActions, trigger]);

  return ref;
}
