"use client";

import Image from "next/image";
import { useParallax } from "@/hooks/use-parallax";

export function ParallaxImage() {
  const imageRef = useParallax<HTMLDivElement>({ speed: 0.3 });

  return (
    <div ref={imageRef} className="relative flex min-w-0 items-center justify-center">
      <div className="relative h-64 w-64 max-w-full sm:h-96 sm:w-96">
        <div className="from-emerald/30 via-teal/30 animate-pulse-slow absolute -inset-2 rounded-full bg-gradient-to-br to-transparent blur-3xl sm:-inset-4" />
        <div
          className="from-emerald/20 via-teal/20 animate-spin-slow absolute inset-0 rounded-full bg-gradient-to-br to-transparent blur-2xl"
          style={{ animationDuration: "8s" }}
        />
        <div className="glow-border relative h-full w-full overflow-hidden rounded-2xl">
          <Image
            src="/mehedi_hasan.webp"
            alt="Mehedi Hasan"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 256px, 384px"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
