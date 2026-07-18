"use client";

import { Star, GitFork, GitPullRequest, Users } from "lucide-react";

export function GitHubStats() {
  const items = [
    { icon: Star, label: "Stars Earned", value: "20+" },
    { icon: GitFork, label: "Repos Forked", value: "15+" },
    { icon: GitPullRequest, label: "Pull Requests", value: "30+" },
    { icon: Users, label: "Followers", value: "25+" },
  ];

  return (
    <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="glass group relative rounded-xl p-5 text-center transition-all duration-500 hover:-translate-y-0.5 hover:border-white/20"
        >
          <div className="from-emerald/5 via-teal/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative z-10">
            <Icon className="text-emerald mx-auto mb-2 h-5 w-5" />
            <div className="font-heading text-gradient text-2xl font-bold">{value}</div>
            <div className="text-muted-foreground mt-1 text-xs">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
