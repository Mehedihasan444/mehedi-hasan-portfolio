"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

export function TimelineLine() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1.5,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: lineRef.current.parentElement,
              start: "top 60%",
              end: "bottom 40%",
              scrub: 1,
            },
          },
        );
      }
    }, lineRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={lineRef}
      className="h-full w-full origin-top"
      style={{
        background: "linear-gradient(to bottom, #059669, #06b6d4, transparent)",
        transform: "scaleY(0)",
      }}
    />
  );
}
