import { Star, GitFork, GitPullRequest, Users } from "lucide-react";

export const languages = [
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
