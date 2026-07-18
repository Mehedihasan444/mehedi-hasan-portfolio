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

const PixelatedImageTrail = dynamic(
  () => import("./pixelated-image-trail").then((m) => ({ default: m.PixelatedImageTrail })),
  { ssr: false },
);

const FluidMorphBackground = dynamic(
  () => import("./fluid-morph-background").then((m) => ({ default: m.FluidMorphBackground })),
  { ssr: false },
);

const LoadingIntro = dynamic(
  () => import("./loading-intro").then((m) => ({ default: m.LoadingIntro })),
  { ssr: false },
);

function DelayedMount({ children, ms }: { children: React.ReactNode; ms: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setShow(true), ms);
    return () => clearTimeout(id);
  }, [ms]);
  return show ? <>{children}</> : null;
}

export function ClientAnimations() {
  const [interacted, setInteracted] = useState(false);
  const trackerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tracker = trackerRef.current;
    if (!tracker) return;

    const onInteraction = () => setInteracted(true);
    const onScrollVisible = () => {
      const rect = tracker.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        setInteracted(true);
      }
    };

    document.addEventListener("mousemove", onInteraction, { once: true });
    document.addEventListener("touchstart", onInteraction, { once: true });
    document.addEventListener("keydown", onInteraction, { once: true });
    window.addEventListener("scroll", onScrollVisible, { once: true, passive: true });

    return () => {
      document.removeEventListener("mousemove", onInteraction);
      document.removeEventListener("touchstart", onInteraction);
      document.removeEventListener("keydown", onInteraction);
      window.removeEventListener("scroll", onScrollVisible);
    };
  }, []);

  return (
    <>
      <div ref={trackerRef} aria-hidden />
      {interacted && (
        <>
          <CustomCursor />
          <ParticleBackground />
          <PixelatedImageTrail />
          <FluidMorphBackground />
          <ScrollProgress />
        </>
      )}
    </>
  );
}
