"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { CharacterScrollOut } from "@/components/animations/character-scroll-out";
import { HeroContent } from "./hero/hero-content";
import { SplitChars } from "./hero/split-chars";
import { ScrollIndicator } from "./hero/scroll-indicator";

const GlobeBackground = dynamic(
  () => import("@/components/3d/globe-background").then((m) => ({ default: m.GlobeBackground })),
  { ssr: false, loading: () => null },
);

const GlitterWrapBackground = dynamic(
  () =>
    import("@/components/3d/glitter-wrap-background").then((m) => ({
      default: m.GlitterWrapBackground,
    })),
  { ssr: false, loading: () => null },
);

const AuroraShaderBackground = dynamic(
  () =>
    import("@/components/ui/animated-shader-background").then((m) => ({
      default: m.AuroraShaderBackground,
    })),
  { ssr: false, loading: () => null },
);

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [bgLevel, setBgLevel] = useState<"full" | "reduced" | "minimal">("full");

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lowPerf =
      navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4;
    if (mql.matches || lowPerf) {
      setBgLevel(lowPerf ? "minimal" : "reduced");
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.6]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="fixed inset-0 z-0" aria-hidden>
        <GlobeBackground />
        {bgLevel === "full" && (
          <GlitterWrapBackground
            particleCount={180}
            color1="#34d399"
            color2="#06b6d4"
            color3="#a78bfa"
            className="[mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,transparent_30%,black_70%)]"
          />
        )}
        {bgLevel !== "minimal" && <AuroraShaderBackground className="absolute inset-0" />}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(5,8,16,0.8) 0%, rgba(5,8,16,0.55) 50%, rgba(5,8,16,0.9) 100%)",
          }}
          aria-hidden
        />
      </div>

      <section
        ref={sectionRef}
        id="hero"
        className="relative z-10 flex min-h-screen flex-col overflow-hidden"
        aria-label="Hero — Mehedi Hasan"
      >
        <motion.div
          style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
          className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-24"
        >
          <HeroContent />
        </motion.div>

        <CharacterScrollOut
          ariaLabel="Hi, I'm Mehedi Hasan"
          className="relative z-10 w-full px-6 pb-12 md:px-10"
        >
          <h1 className="font-heading text-center text-5xl font-bold uppercase leading-[1.08] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            <SplitChars text="Hi, I'm " />
            <SplitChars
              text="Mehedi Hasan"
              className="from-violet-soft via-violet to-cyan bg-gradient-to-r bg-clip-text text-transparent"
            />
          </h1>
        </CharacterScrollOut>

        <ScrollIndicator onClick={scrollToAbout} />
      </section>
    </>
  );
}
