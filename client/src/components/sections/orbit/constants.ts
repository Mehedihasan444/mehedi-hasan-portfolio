export interface OrbitPlanet {
  id: string;
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  color: string;
  emissive: string;
  /** planet sphere radius */
  size: number;
  /** angular speed (radians per second at 60fps time base) */
  speed: number;
  /** starting angle in radians */
  phase: number;
  /** orbit ring index at section progress 0 */
  fromOrbit: number;
  /** orbit ring index at section progress 1 */
  toOrbit: number;
  /** [start, end] window of section progress (0..1) during which migration happens */
  window: [number, number];
  /** tilt of the planet's own orbital plane contribution (radians, applied as y wobble) */
  tilt: number;
  ringed?: boolean;
}

export const ORBIT_RADII = [3.4, 4.8, 6.2, 7.6];

export const ORBIT_PHASES = [
  { label: "Inner orbits", caption: "Core stack — what I reach for every day." },
  { label: "Transfer orbits", caption: "Scroll on — the system is migrating outward." },
  { label: "Outer orbits", caption: "Full range — everything in motion, all at once." },
] as const;

export const ORBIT_PLANETS: OrbitPlanet[] = [
  {
    id: "frontend",
    name: "Frontend",
    tagline: "Interfaces people love",
    description:
      "React and Next.js apps with TypeScript end to end — server components, streaming, and just enough client JS.",
    tags: ["React", "Next.js", "TypeScript"],
    color: "#34D399",
    emissive: "#059669",
    size: 0.42,
    speed: 0.32,
    phase: 0.4,
    fromOrbit: 0,
    toOrbit: 2,
    window: [0.05, 0.45],
    tilt: 0.06,
  },
  {
    id: "backend",
    name: "Backend",
    tagline: "APIs that hold up",
    description:
      "Node.js and Express services — auth, validation, rate limiting, and clean module boundaries.",
    tags: ["Node.js", "Express", "REST"],
    color: "#22D3EE",
    emissive: "#0891B2",
    size: 0.36,
    speed: 0.26,
    phase: 2.4,
    fromOrbit: 1,
    toOrbit: 3,
    window: [0.2, 0.6],
    tilt: -0.05,
  },
  {
    id: "data",
    name: "Data",
    tagline: "Models that make sense",
    description:
      "Postgres and Mongo behind Prisma or Mongoose — typed schemas, migrations, and seed data that actually helps.",
    tags: ["PostgreSQL", "MongoDB", "Prisma"],
    color: "#A78BFA",
    emissive: "#7C3AED",
    size: 0.39,
    speed: 0.22,
    phase: 4.2,
    fromOrbit: 0,
    toOrbit: 3,
    window: [0.35, 0.75],
    tilt: 0.08,
    ringed: true,
  },
  {
    id: "cloud",
    name: "Cloud",
    tagline: "Ships and stays up",
    description:
      "Dockerized builds, Vercel deploys, and CI pipelines — preview per PR, migrate on release.",
    tags: ["Docker", "Vercel", "CI/CD"],
    color: "#7DD3FC",
    emissive: "#0284C7",
    size: 0.3,
    speed: 0.38,
    phase: 1.2,
    fromOrbit: 2,
    toOrbit: 1,
    window: [0.15, 0.55],
    tilt: -0.07,
  },
  {
    id: "motion",
    name: "Motion",
    tagline: "Delight, responsibly",
    description:
      "Three.js scenes, GSAP timelines, and Framer Motion — always gated on reduced-motion and real device budgets.",
    tags: ["Three.js", "GSAP", "Framer Motion"],
    color: "#5EEAD4",
    emissive: "#0D9488",
    size: 0.33,
    speed: 0.3,
    phase: 5.3,
    fromOrbit: 1,
    toOrbit: 2,
    window: [0.5, 0.9],
    tilt: 0.05,
  },
];

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Orbit radius for a planet at a given section scroll progress (0..1). */
export function planetOrbitRadius(planet: OrbitPlanet, progress: number): number {
  const from = ORBIT_RADII[planet.fromOrbit] ?? ORBIT_RADII[0] ?? 3.4;
  const to = ORBIT_RADII[planet.toOrbit] ?? from;
  const [w0, w1] = planet.window;
  return from + (to - from) * smoothstep(w0, w1, progress);
}
