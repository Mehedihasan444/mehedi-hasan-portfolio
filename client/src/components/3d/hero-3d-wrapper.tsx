"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const Scene3D = dynamic(
  () => import("@/components/3d/hero-scene").then((mod) => ({ default: mod.HeroScene })),
  {
    ssr: false,
    loading: () => <div className="h-96 w-96 animate-pulse rounded-full bg-white/5" />,
  },
);

export function Hero3DWrapper() {
  return (
    <Suspense fallback={<div className="h-96 w-96 animate-pulse rounded-full bg-white/5" />}>
      <Scene3D />
    </Suspense>
  );
}
