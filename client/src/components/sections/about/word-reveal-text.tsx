"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

export function WordRevealText({ children }: { children: string }) {
  const pRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const p = pRef.current;
    if (!p) return;

    const text = p.textContent || "";
    p.innerHTML = "";
    text.split(" ").forEach((word, i) => {
      const span = document.createElement("span");
      span.textContent = word;
      span.style.display = "inline-block";
      span.style.opacity = "0";
      span.style.transform = "translateY(18px)";
      p.appendChild(span);
      if (i < text.split(" ").length - 1) {
        p.appendChild(document.createTextNode("\u00A0"));
      }
    });

    const ctx = gsap.context(() => {
      gsap.to(p.querySelectorAll("span"), {
        opacity: 1,
        y: 0,
        stagger: 0.025,
        duration: 0.55,
        ease: "power3.out",
        scrollTrigger: {
          trigger: p,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }, p);
    return () => ctx.revert();
  }, []);

  return (
    <p ref={pRef} className="reveal-text leading-relaxed">
      {children}
    </p>
  );
}
