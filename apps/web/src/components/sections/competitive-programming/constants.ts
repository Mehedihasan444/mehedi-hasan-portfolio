// Fallback content for the Competitive Programming section, used when the
// `/competitive-profiles` and `/competitive-stats` API endpoints return
// nothing (API down, fresh DB, build time). Edits in the admin dashboard
// (`/admin/competitive-programming`) take precedence over everything here.
//
// Visuals (icon + accent) are resolved from `cpVisuals` by platform name, so
// admin-added platforms render without any code change.

import {
  Code2,
  Trophy,
  Target,
  Award,
  Medal,
  Flame,
  Brain,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface CPProfileData {
  platform: string;
  handle: string;
  url: string | null;
  stat: string;
  detail: string | null;
  badge: string | null;
}

export interface CPStatData {
  value: string;
  label: string;
}

export interface CPVisual {
  icon: LucideIcon;
  accent: string;
  chip: string;
}

const defaultVisual: CPVisual = { icon: Code2, accent: "text-cyan", chip: "bg-cyan/10" };

const cpVisuals: Record<string, CPVisual> = {
  leetcode: { icon: Code2, accent: "text-amber", chip: "bg-amber/10" },
  codeforces: { icon: Trophy, accent: "text-cyan", chip: "bg-cyan/10" },
  codechef: { icon: Target, accent: "text-emerald", chip: "bg-emerald/10" },
  beecrowd: { icon: Flame, accent: "text-orange", chip: "bg-orange/10" },
  code360: { icon: Sparkles, accent: "text-violet", chip: "bg-violet/10" },
  hackerrank: { icon: Award, accent: "text-teal", chip: "bg-teal/10" },
  atcoder: { icon: Medal, accent: "text-rose", chip: "bg-rose/10" },
  lightoj: { icon: Flame, accent: "text-orange", chip: "bg-orange/10" },
  hackerearth: { icon: Brain, accent: "text-violet", chip: "bg-violet/10" },
  geeksforgeeks: { icon: Sparkles, accent: "text-lime", chip: "bg-lime/10" },
};

export function cpVisualFor(platform: string): CPVisual {
  return cpVisuals[platform.trim().toLowerCase()] ?? defaultVisual;
}

// The CV lists the profiles but no solve counts, ratings, ranks or badges, so
// no numeric claim is made here. Keep stats empty unless real numbers are
// entered in the admin dashboard.
export const fallbackCpStats: CPStatData[] = [];

export const fallbackCpProfiles: CPProfileData[] = [
  {
    platform: "LeetCode",
    handle: "@hPV4TdImNk",
    url: "https://leetcode.com/u/hPV4TdImNk/",
    stat: "",
    detail: null,
    badge: null,
  },
  {
    platform: "Codeforces",
    handle: "@Mehedihasan444",
    url: "https://codeforces.com/profile/Mehedihasan444",
    stat: "",
    detail: null,
    badge: null,
  },
  {
    platform: "CodeChef",
    handle: "@mehedihasan444",
    url: "https://www.codechef.com/users/mehedihasan444",
    stat: "",
    detail: null,
    badge: null,
  },
  {
    platform: "BeeCrowd",
    handle: "@671804",
    url: "https://judge.beecrowd.com/en/profile/671804",
    stat: "",
    detail: null,
    badge: null,
  },
  {
    platform: "Code360",
    handle: "Naukri Code360",
    url: "https://www.naukri.com/code360/profile/60d5b245-ce3b-47bb-a428-15de27f9f2ad",
    stat: "",
    detail: null,
    badge: null,
  },
];
