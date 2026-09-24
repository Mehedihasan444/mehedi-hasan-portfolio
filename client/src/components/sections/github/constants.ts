// Single source of truth for the GitHub section's offline sample snapshot.
// Do not duplicate these arrays inline in github-stats / language-breakdown —
// import from here. Values are static placeholders until live GitHub API wiring lands.
import { Star, GitFork, GitPullRequest, Users } from "lucide-react";

export type GHLang = { name: string; percentage: number; color: string };

export const languages: GHLang[] = [
  { name: "TypeScript", percentage: 45, color: "#3178c6" },
  { name: "JavaScript", percentage: 25, color: "#f7df1e" },
  { name: "HTML/CSS", percentage: 15, color: "#f16529" },
  { name: "Python", percentage: 10, color: "#3776ab" },
  { name: "Other", percentage: 5, color: "#6b7280" },
];

export const ghStats = [
  { icon: Star, label: "Stars Earned", value: "20+" },
  { icon: GitFork, label: "Repos Forked", value: "15+" },
  { icon: GitPullRequest, label: "Pull Requests", value: "30+" },
  { icon: Users, label: "Followers", value: "25+" },
];
