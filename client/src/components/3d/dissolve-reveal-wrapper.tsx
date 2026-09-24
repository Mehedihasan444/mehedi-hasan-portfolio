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
  const [mounted, setMounted] = useState(false);
  const [staticMode, setStaticMode] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setMounted(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    // Rule 6 (reduced-motion bypass): show the final image immediately, no WebGL.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      setStaticMode(true);
      return;
    }

    const container = containerRef.current;
    let raf = 0;

    const compute = () => {
      if (!container) return;
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

    // rAF-throttled scroll handling; skipped while the tab is hidden.
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (document.hidden) return;
        compute();
      });
    };

    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    compute();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // SSR-safe: render a plain image on the server / pre-mount and for reduced-motion.
  // The Canvas only ever mounts client-side on capable devices.
  const showCanvas = mounted && !staticMode;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {showCanvas ? (
        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 0, 2], fov: 50 }}
            dpr={[1, 1.5]}
            frameloop={paused ? "never" : "always"}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            style={{ background: "transparent" }}
          >
            <ScrollDissolveReveal imageSrc={imageSrc} progress={progress} />
          </Canvas>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- intentional plain <img> for the pre-WebGL static fallback (no optimizer benefit)
        <img
          src={imageSrc}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
