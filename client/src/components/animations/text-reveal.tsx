"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

interface TextRevealProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  type?: "chars" | "words" | "lines";
  stagger?: number;
  duration?: number;
  y?: number;
  delay?: number;
  once?: boolean;
}

export function TextReveal({
  children,
  as: Tag = "p",
  className = "",
  type = "words",
  stagger = 0.03,
  duration = 0.8,
  y = 40,
  delay = 0,
  once = true,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const el = textRef.current;
    if (!container || !el) return;

    const text = children;
    const wrapper = document.createElement("span");
    wrapper.style.display = "inline";
    wrapper.textContent = text;
    container.innerHTML = "";
    container.appendChild(wrapper);

    const chars = wrapper.textContent || "";
    const fragments: HTMLSpanElement[] = [];

    if (type === "chars") {
      wrapper.innerHTML = "";
      chars.split("").forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        fragments.push(span);
        wrapper.appendChild(span);
      });
    } else {
      wrapper.innerHTML = "";
      chars.split(/(\s+)/).forEach((word) => {
        const span = document.createElement("span");
        span.textContent = word;
        span.style.display = "inline-block";
        fragments.push(span);
        wrapper.appendChild(span);
      });
    }

    gsap.set(fragments, { opacity: 0, y, willChange: "transform, opacity" });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay,
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: once ? "play none none none" : "play none none reverse",
        },
      });

      tl.to(fragments, {
        opacity: 1,
        y: 0,
        stagger,
        duration,
        ease: "power3.out",
      });
    }, container);

    return () => {
      ctx.revert();
      container.textContent = text;
    };
  }, [children, type, stagger, duration, y, delay, once]);

  if (type === "chars") {
    return <div ref={containerRef} className={className} aria-label={children} />;
  }

  return (
    <Tag ref={textRef as unknown as never} className={className}>
      <div ref={containerRef} className="inline" aria-label={children} />
    </Tag>
  );
}
