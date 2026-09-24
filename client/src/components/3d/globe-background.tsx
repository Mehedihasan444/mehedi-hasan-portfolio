"use client";

import { useEffect, useState, useRef, memo } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";

const Scene3D = dynamic(() => import("./globe-scene").then((m) => ({ default: m.GlobeScene })), {
  ssr: false,
});

interface GlobeBackgroundProps {
  className?: string;
}

function GlobeCanvas({ className }: GlobeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // Rule 1: render nothing (no WebGL) for reduced-motion or touch devices.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    // Rule 4: gate heavy WebGL boot behind idle (requestIdleCallback, fallback setTimeout 500ms).
    // The remote geojson fetch itself lives in globe-scene.tsx <LandDots/>, which already has
    // try/catch + `cache: "force-cache"` + idle defer + AbortController + geometry/material disposal.
    let cancelled = false;
    let idleId = 0;
    let timeoutId = 0;
    const boot = () => {
      if (cancelled) return;
      if (document.hidden) {
        // Tab hidden — retry shortly instead of burning GPU on an invisible canvas.
        timeoutId = window.setTimeout(boot, 500);
        return;
      }
      setReady(true);
    };
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(boot, { timeout: 2000 });
    } else {
      timeoutId = window.setTimeout(boot, 500);
    }

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      if (idleId) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  if (!ready) return null;

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none fixed inset-0 z-0 ${className ?? ""}`}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop={paused ? "never" : "always"}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Scene3D />
      </Canvas>
    </div>
  );
}

export const GlobeBackground = memo(GlobeCanvas);
