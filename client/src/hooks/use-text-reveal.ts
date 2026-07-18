"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface UseTextRevealOptions {
  type?: "chars" | "words" | "lines";
  stagger?: number;
  duration?: number;
  y?: number;
  scrollTrigger?: boolean;
  start?: string;
}

export function useTextReveal<T extends HTMLElement>(options: UseTextRevealOptions = {}) {
  const ref = useRef<T>(null);
  const {
    type = "words",
    stagger = 0.03,
    duration = 0.8,
    y = 40,
    scrollTrigger = true,
    start = "top 85%",
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const text = el.textContent || "";
    el.textContent = "";

    const fragments: HTMLSpanElement[] = [];
    let split: string[];

    switch (type) {
      case "chars":
        split = text.split("");
        break;
      case "lines":
        split = text.split(" ");
        break;
      default:
        split = text.split(" ");
    }

    split.forEach((part) => {
      const span = document.createElement("span");
      span.textContent = part + (type === "chars" ? "" : " ");
      span.style.display = "inline-block";
      span.style.opacity = "0";
      span.style.transform = `translateY(${y}px)`;
      el.appendChild(span);
      fragments.push(span);
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration },
        ...(scrollTrigger
          ? {
              scrollTrigger: {
                trigger: el,
                start,
                toggleActions: "play none none reverse",
              },
            }
          : {}),
      });

      tl.to(fragments, {
        opacity: 1,
        y: 0,
        stagger,
        duration,
      });
    }, el);

    return () => {
      ctx.revert();
      el.textContent = text;
    };
  }, [type, stagger, duration, y, scrollTrigger, start]);

  return ref;
}
