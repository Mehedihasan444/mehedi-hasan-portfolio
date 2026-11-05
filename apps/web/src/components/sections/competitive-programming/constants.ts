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
  hackerrank: { icon: Award, accent: "text-teal", chip: "bg-teal/10" },
  atcoder: { icon: Medal, accent: "text-rose", chip: "bg-rose/10" },
  lightoj: { icon: Flame, accent: "text-orange", chip: "bg-orange/10" },
  hackerearth: { icon: Brain, accent: "text-violet", chip: "bg-violet/10" },
  geeksforgeeks: { icon: Sparkles, accent: "text-lime", chip: "bg-lime/10" },
};

export function cpVisualFor(platform: string): CPVisual {
  return cpVisuals[platform.trim().toLowerCase()] ?? defaultVisual;
}

export const fallbackCpStats: CPStatData[] = [
  { value: "800+", label: "Problems Solved" },
  { value: "120+", label: "Contests Joined" },
  { value: "4", label: "Active Platforms" },
  { value: "3+", label: "Years of Practice" },
];

export const fallbackCpProfiles: CPProfileData[] = [
  {
    platform: "LeetCode",
    handle: "@Mehedihasan444",
    url: "https://leetcode.com/u/Mehedihasan444/",
    stat: "500+ solved",
    detail: "Data structures & algorithms practice",
    badge: "Knight badge",
  },
  {
    platform: "Codeforces",
    handle: "@Mehedihasan444",
    url: "https://codeforces.com/profile/Mehedihasan444",
    stat: "Specialist · 1400+",
    detail: "Rated contests & problem sets",
    badge: "Specialist",
  },
  {
    platform: "CodeChef",
    handle: "@mehedihasan444",
    url: "https://www.codechef.com/users/mehedihasan444",
    stat: "3★ · 1600+",
    detail: "Long challenges & cook-offs",
    badge: "3 Star",
  },
  {
    platform: "HackerRank",
    handle: "@Mehedihasan444",
    url: "https://www.hackerrank.com/profile/Mehedihasan444",
    stat: "5★ Problem Solving",
    detail: "Gold badges in DSA tracks",
    badge: "Gold",
  },
];
