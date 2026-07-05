"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(
  () => import("./custom-cursor").then((m) => ({ default: m.CustomCursor })),
  { ssr: false },
);

const ParticleBackground = dynamic(
  () => import("./particle-background").then((m) => ({ default: m.ParticleBackground })),
  { ssr: false },
);

const LoadingIntro = dynamic(
  () => import("./loading-intro").then((m) => ({ default: m.LoadingIntro })),
  { ssr: false },
);

const ScrollProgress = dynamic(
  () => import("./scroll-progress").then((m) => ({ default: m.ScrollProgress })),
  { ssr: false },
);

export function ClientAnimations() {
  return (
    <>
      <LoadingIntro />
      <CustomCursor />
      <ParticleBackground />
      <ScrollProgress />
    </>
  );
}
