import { heroStats } from "@/lib/stats";

// Single source of truth lives in src/lib/stats.ts — re-exported here
// so existing `import { stats } from "./constants"` keeps working.
export const stats = heroStats;

export const roles = [
  "Full Stack Developer",
  "React & Next.js Engineer",
  "Backend Developer",
  "Open Source Contributor",
  "UI/UX Enthusiast",
];

export const terminalLines = [
  { prefix: "~", cmd: "npx create-next-app portfolio", delay: 0.2 },
  { prefix: "~", cmd: "cd portfolio && npm install", delay: 1.8 },
  { prefix: "~", cmd: "npm run dev", delay: 3.2 },
];
