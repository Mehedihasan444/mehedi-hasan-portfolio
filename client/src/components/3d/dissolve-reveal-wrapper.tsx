"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollDissolveReveal } from "./scroll-dissolve-reveal";

interface DissolveRevealWrapperProps {
  imageSrc: string;
  className?: string;
  children?: React.ReactNode;
}

export function DissolveRevealWrapper({
  imageSrc,
  className = "",
  children,
}: DissolveRevealWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(windowHeight, rect.bottom);
      const visibleHeight = visibleBottom - visibleTop;
      const totalHeight = rect.height;

      if (totalHeight <= 0) return;
      const p = 1 - visibleHeight / totalHeight;
      setProgress(Math.max(0, Math.min(1, p)));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 2], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <ScrollDissolveReveal imageSrc={imageSrc} progress={progress} />
        </Canvas>
      </div>
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
