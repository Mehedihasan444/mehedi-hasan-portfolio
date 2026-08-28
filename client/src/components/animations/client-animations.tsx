"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(
  () => import("./custom-cursor").then((m) => ({ default: m.CustomCursor })),
  { ssr: false },
);

const ParticleBackground = dynamic(
  () => import("./particle-background").then((m) => ({ default: m.ParticleBackground })),
  { ssr: false },
);

const ScrollProgress = dynamic(
  () => import("./scroll-progress").then((m) => ({ default: m.ScrollProgress })),
  { ssr: false },
);

const FluidMorphBackground = dynamic(
  () => import("./fluid-morph-background").then((m) => ({ default: m.FluidMorphBackground })),
  { ssr: false },
);

export function ClientAnimations() {
  const [interacted, setInteracted] = useState(false);
  const trackerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tracker = trackerRef.current;
    if (!tracker) return;

    const onInteraction = () => setInteracted(true);
    const onScrollVisible = () => {
      const rect = tracker.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        setInteracted(true);
      }
    };

    // Defer listeners to idle to avoid blocking initial paint
    const start = () => {
      document.addEventListener("mousemove", onInteraction, { once: true });
      document.addEventListener("keydown", onInteraction, { once: true });
      window.addEventListener("scroll", onScrollVisible, { once: true, passive: true });
      // touch alone no longer triggers heavy canvas on mobile
    };
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(start, { timeout: 1500 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(start, 600);
    return () => {
      clearTimeout(id);
      document.removeEventListener("mousemove", onInteraction);
      document.removeEventListener("keydown", onInteraction);
      window.removeEventListener("scroll", onScrollVisible);
    };
  }, []);

  // Only mount heavy canvases on fine pointer devices; mobile gets lightweight scroll indicator only
  const isCoarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  return (
    <>
      <div ref={trackerRef} aria-hidden />
      {interacted && !isCoarse && (
        <>
          <CustomCursor />
          <ParticleBackground />
          <FluidMorphBackground />
        </>
      )}
      {interacted && <ScrollProgress />}
    </>
  );
}
