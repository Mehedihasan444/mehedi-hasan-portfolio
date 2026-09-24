import { achievementMetrics } from "@/lib/stats";

// Single source of truth lives in src/lib/stats.ts — re-exported here
// so existing `import { metrics } from "./achievements/constants"` keeps working.
export const metrics = achievementMetrics;
// NOTE: achievementList (hardcoded fallback cards) was removed — Grep showed zero
// imports. This section now renders metrics from stats.ts plus live API achievements.
