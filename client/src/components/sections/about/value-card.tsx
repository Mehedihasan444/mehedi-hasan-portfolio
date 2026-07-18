"use client";

import { Code2, Lightbulb, Microscope, Puzzle, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Lightbulb,
  Microscope,
  Puzzle,
};

interface ValueItem {
  icon: string;
  title: string;
  desc: string;
  gradient: string;
  color: string;
}

export function ValueCard({ item }: { item: ValueItem }) {
  const Icon = iconMap[item.icon];
  return (
    <div className="group h-full">
      <div className="glass glass-hover group relative rounded-xl p-6 transition-all duration-500">
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
        />
        <div className="relative z-10">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 transition-all duration-300 group-hover:bg-white/10">
            <Icon className={`h-5 w-5 ${item.color}`} />
          </div>
          <h3 className="font-medium text-white">{item.title}</h3>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{item.desc}</p>
        </div>
      </div>
    </div>
  );
}
