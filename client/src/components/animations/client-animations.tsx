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
  const [isCoarse, setIsCoarse] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
  );
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const trackerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount/external-system sync
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setIsCoarse(window.matchMedia("(pointer: coarse)").matches);
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

    let idleId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let started = false;

    // Defer listeners to idle to avoid blocking initial paint
    const start = () => {
      started = true;
      document.addEventListener("mousemove", onInteraction, { once: true, passive: true });
      document.addEventListener("keydown", onInteraction, { once: true });
      window.addEventListener("scroll", onScrollVisible, { once: true, passive: true });
      // touch alone no longer triggers heavy canvas on mobile
    };
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(start, { timeout: 1500 });
    } else {
      timeoutId = setTimeout(start, 600);
    }
    return () => {
      if (idleId) window.cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);
      if (started) {
        document.removeEventListener("mousemove", onInteraction);
        document.removeEventListener("keydown", onInteraction);
        window.removeEventListener("scroll", onScrollVisible);
      }
    };
  }, []);

  // Only mount heavy canvases on fine pointer devices; mobile gets lightweight scroll indicator only.
  // Reduced-motion users get the lightweight indicator only (no heavy canvases).

  return (
    <>
      <div ref={trackerRef} aria-hidden />
      {interacted && !isCoarse && !reducedMotion && (
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
