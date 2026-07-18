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
  const [dpr, setDpr] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 800 });

  useEffect(() => {
    const dprVal = Math.min(window.devicePixelRatio, 2);
    /* eslint-disable react-hooks/set-state-in-effect */
    setDpr(dprVal);
    setCanvasSize({ w: window.innerWidth, h: window.innerHeight });
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */

    const onResize = () => {
      setCanvasSize({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
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
        dpr={[1, dpr]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{
          width: canvasSize.w,
          height: canvasSize.h,
          background: "transparent",
        }}
      >
        <Scene3D />
      </Canvas>
    </div>
  );
}

export const GlobeBackground = memo(GlobeCanvas);
