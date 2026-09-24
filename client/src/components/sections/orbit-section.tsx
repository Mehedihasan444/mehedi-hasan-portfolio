"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ORBIT_PHASES, ORBIT_PLANETS } from "./orbit/constants";

const OrbitScene = dynamic(
  () => import("./orbit/orbit-scene").then((m) => ({ default: m.OrbitScene })),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-full w-full items-center justify-center"
        role="status"
        aria-label="Loading 3D orbit system"
      >
        <div className="border-emerald/30 h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    ),
  },
);

const SUN_INFO = {
  id: "sun",
  name: "The Sun — Me",
  tagline: "Full-stack gravity",
  description:
    "Everything here orbits the same center: shipping useful software. Scroll to move the planets between orbits — hover or tap anything for details.",
  tags: ["Portfolio", "Scroll-driven", "Three.js"],
};

type Info = typeof SUN_INFO;

function infoFor(id: string | null): Info {
  if (!id || id === "sun") return SUN_INFO;
  const planet = ORBIT_PLANETS.find((p) => p.id === id);
  if (!planet) return SUN_INFO;
  return {
    id: planet.id,
    name: planet.name,
    tagline: planet.tagline,
    description: planet.description,
    tags: planet.tags,
  };
}

export function OrbitSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const timeRef = useRef(0);
  const rafRef = useRef(0);
  const lastPhaseRef = useRef(0);

  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [active, setActive] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [phase, setPhase] = useState(0);

  // Feature-detect once: reduced motion + idle-deferred WebGL boot.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount/external-system sync
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(() => setReady(true), 600);
    return () => window.clearTimeout(t);
  }, []);

  const update = useCallback(() => {
    rafRef.current = 0;
    const el = containerRef.current;
    if (!el || typeof window === "undefined") return;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top;
    const p = total > 0 ? Math.min(1, Math.max(0, -top / total)) : 0;
    scrollRef.current = p;
    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${p})`;
    }
    const nextPhase = p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2;
    if (nextPhase !== lastPhaseRef.current) {
      lastPhaseRef.current = nextPhase;
      setPhase(nextPhase);
    }
  }, []);

  // rAF-throttled scroll tracking (no per-event setState).
  useEffect(() => {
    const schedule = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [update]);

  // Pause the WebGL loop while the section is offscreen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry?.isIntersecting ?? true),
      {
        threshold: 0,
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleHover = useCallback((id: string | null) => {
    setHoveredId(id);
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleMiss = useCallback(() => {
    setSelectedId(null);
  }, []);

  const info = infoFor(selectedId ?? hoveredId);
  const phaseInfo = ORBIT_PHASES[phase] ?? ORBIT_PHASES[0] ?? { label: "", caption: "" };

  return (
    <section
      ref={containerRef}
      id="orbit"
      aria-label="Orbit system — scroll-driven 3D planets"
      className="relative"
      style={{ height: "420vh" }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="from-emerald/5 via-teal/5 absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-b to-transparent blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24 text-center">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-[0.3em]">
            The System
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            One sun. <span className="text-gradient">Five orbits.</span>
          </h2>
          <p
            className="text-muted-foreground mx-auto mt-3 max-w-xl text-sm sm:text-base"
            role="status"
          >
            <span className="font-semibold text-white/80">{phaseInfo.label} — </span>
            {phaseInfo.caption}
          </p>
        </div>

        <div className="relative min-h-0 flex-1">
          {ready && (
            <OrbitScene
              scrollRef={scrollRef}
              timeRef={timeRef}
              reducedMotion={reducedMotion}
              active={active}
              hoveredId={hoveredId}
              selectedId={selectedId}
              onHover={handleHover}
              onSelect={handleSelect}
              onMiss={handleMiss}
            />
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mx-auto w-full max-w-7xl px-6 pb-6">
            <div className="pointer-events-auto max-w-sm rounded-2xl border border-white/10 bg-[#050810]/80 p-5 text-left backdrop-blur-md">
              <div aria-live="polite">
                <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-emerald-300">
                  {info.tagline}
                </p>
                <h3 className="mt-1 text-xl font-bold text-white">{info.name}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {info.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {info.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-muted-foreground rounded-full bg-white/5 px-2.5 py-0.5 text-[11px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-8">
          <div
            className="flex flex-wrap items-center justify-center gap-2"
            role="group"
            aria-label="Select a celestial body"
          >
            <PlanetChip
              label="Sun"
              color="#FDE68A"
              pressed={selectedId === "sun"}
              onClick={() => setSelectedId("sun")}
            />
            {ORBIT_PLANETS.map((planet) => (
              <PlanetChip
                key={planet.id}
                label={planet.name}
                color={planet.color}
                pressed={selectedId === planet.id}
                onClick={() => setSelectedId((prev) => (prev === planet.id ? null : planet.id))}
              />
            ))}
          </div>
          <p className="text-muted-foreground mt-4 text-center text-xs">
            <span className="inline-block motion-safe:animate-bounce" aria-hidden="true">
              ↓
            </span>{" "}
            Scroll to move planets between orbits — tap a planet for details
          </p>
          <div
            className="bg-emerald/60 mx-auto mt-4 h-px w-full max-w-md origin-left"
            style={{ transform: "scaleX(0)" }}
            ref={barRef}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}

function PlanetChip({
  label,
  color,
  pressed,
  onClick,
}: {
  label: string;
  color: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 ${
        pressed
          ? "border-white/30 bg-white/10 text-white"
          : "text-muted-foreground border-white/10 bg-white/[0.03] hover:border-white/25 hover:text-white"
      }`}
    >
      <span
        aria-hidden="true"
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </button>
  );
}
