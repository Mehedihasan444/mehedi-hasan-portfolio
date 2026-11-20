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

function hasWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function GlobeCanvas({ className }: GlobeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  // WebGL contexts can be dropped by the driver on memory pressure. Without a remount the
  // canvas stays blank for the rest of the session ("the globe disappeared"), so rebuild once.
  const [canvasKey, setCanvasKey] = useState(0);
  const recoveredRef = useRef(false);

  useEffect(() => {
    // Rule 1: render nothing (no WebGL) for reduced-motion or touch devices.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches ||
      !hasWebGLSupport()
    ) {
      return;
    }

    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    // Rule 4: gate heavy WebGL boot behind idle (requestIdleCallback, fallback setTimeout 500ms).
    // Land dots come from the precomputed `/globe-land-dots.json` asset in globe-scene.tsx
    // <LandDots/>, which retries on failure and caches the decoded positions at module scope.
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
        key={canvasKey}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop={paused ? "never" : "always"}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            "webglcontextlost",
            (event) => {
              event.preventDefault();
              if (recoveredRef.current) return;
              recoveredRef.current = true;
              setCanvasKey((key) => key + 1);
            },
            { once: true },
          );
        }}
      >
        <Scene3D />
      </Canvas>
    </div>
  );
}

export const GlobeBackground = memo(GlobeCanvas);
