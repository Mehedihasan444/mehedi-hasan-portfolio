"use client";

import { Trophy, GitBranch, BookOpen, Zap, Code2, Coffee, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Trophy,
  GitBranch,
  BookOpen,
  Zap,
  Code2,
  Coffee,
};

interface AchievementItem {
  icon: string;
  title: string;
  description: string;
  color: string;
  bg: string;
}

export function AchievementCard({ item }: { item: AchievementItem }) {
  const Icon = iconMap[item.icon];
  return (
    <div className="group h-full">
      <div className="glass relative h-full rounded-xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/20">
        <div className="from-emerald/5 via-teal/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10 flex gap-4">
          <div
            className={`${item.bg} mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon className={`h-5 w-5 ${item.color}`} />
          </div>
          <div>
            <h3 className="font-medium text-white">{item.title}</h3>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{item.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
