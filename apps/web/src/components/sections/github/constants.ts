// Real numbers pulled from the GitHub REST API for github.com/Mehedihasan444
// on 2026-09-30. Re-fetch (or wire a live fetch) before reusing this snapshot —
// these counts drift over time. Sources noted per field below.
import { Star, GitFork, GitPullRequest, Users } from "lucide-react";

export type GHLang = { name: string; percentage: number; color: string };

// Share of the 80 non-fork public repos by primary language.
// Source: GET /users/Mehedihasan444/repos?per_page=100
export const languages: GHLang[] = [
  { name: "JavaScript", percentage: 34, color: "#f7df1e" },
  { name: "TypeScript", percentage: 32, color: "#3178c6" },
  { name: "HTML", percentage: 21, color: "#e34c26" },
  { name: "CSS", percentage: 2, color: "#563d7c" },
  { name: "C++", percentage: 2, color: "#f34b7d" },
  { name: "Python", percentage: 1, color: "#3776ab" },
  { name: "Other", percentage: 8, color: "#6b7280" },
];

export const ghStats = [
  // GET /users/Mehedihasan444/repos → summed stargazers_count
  { icon: Star, label: "Stars Earned", value: "6" },
  // Same response, filtered to fork: true
  { icon: GitFork, label: "Repos Forked", value: "3" },
  // GET /search/issues?q=author:Mehedihasan444+type:pr
  { icon: GitPullRequest, label: "Pull Requests", value: "125+" },
  { icon: Users, label: "Followers", value: "1" },
];
