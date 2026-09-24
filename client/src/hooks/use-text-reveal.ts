"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface UseTextRevealOptions {
  type?: "chars" | "words";
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
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (el.dataset.textRevealed === "true") return;

    const originalHTML = el.innerHTML;
    const text = el.textContent || "";
    if (!text.trim()) return;

    el.dataset.textRevealed = "true";
    el.textContent = "";

    const fragments: HTMLSpanElement[] = [];
    const split = type === "chars" ? text.split("") : text.split(" ");

    split.forEach((part) => {
      const span = document.createElement("span");
      span.textContent = part + (type === "chars" ? "" : " ");
      span.style.display = "inline-block";
      el.appendChild(span);
      fragments.push(span);
    });

    gsap.set(fragments, { opacity: 0, y });

    const ctx = gsap.context(() => {
      gsap.to(fragments, {
        opacity: 1,
        y: 0,
        stagger,
        duration,
        ease: "power3.out",
        overwrite: true,
        ...(scrollTrigger
          ? {
              scrollTrigger: {
                trigger: el,
                start,
                toggleActions: "play none none none",
                once: true,
              },
            }
          : {}),
      });
    }, el);

    return () => {
      ctx.revert();
      el.innerHTML = originalHTML;
      delete el.dataset.textRevealed;
    };
  }, [type, stagger, duration, y, scrollTrigger, start]);

  return ref;
}
