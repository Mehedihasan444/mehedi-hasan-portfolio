import { heroStats } from "@/lib/stats";

// Single source of truth lives in src/lib/stats.ts — re-exported here
// so existing `import { stats } from "./constants"` keeps working.
export const stats = heroStats;

// Rotating titles in the hero. `roles[0]` is also the screen-reader text,
// so keep the first entry as the single most accurate description.
export const roles = [
  "Full Stack Developer",
  "React & Next.js Engineer",
  "TypeScript Developer",
  "Backend Developer",
  "Open Source Contributor",
];

export const terminalLines = [
  { prefix: "~", cmd: "npx create-next-app portfolio", delay: 0.2 },
  { prefix: "~", cmd: "cd portfolio && npm install", delay: 1.8 },
  { prefix: "~", cmd: "npm run dev", delay: 3.2 },
];
