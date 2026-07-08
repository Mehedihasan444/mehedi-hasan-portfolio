"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experiences: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [projects, skills, experiences, messages] = await Promise.all([
          api.get<any[]>("./projects"),
          api.get<any[]>("./skills"),
          api.get<any[]>("./experiences"),
          api.get<any[]>("./contact"),
        ]);
        setStats({
          projects: projects.length,
          skills: skills.length,
          experiences: experiences.length,
          messages: messages.length,
        });
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const cards = [
    { label: "Projects", value: stats.projects, href: "/admin/projects" },
    { label: "Skills", value: stats.skills, href: "/admin/skills" },
    { label: "Experiences", value: stats.experiences, href: "/admin/experiences" },
    { label: "Messages", value: stats.messages, href: "/admin/messages" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="border-emerald h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <p className="text-muted-foreground mt-1 text-sm">Overview of your portfolio</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="glass glass-hover rounded-xl p-6 transition-all"
          >
            <p className="text-muted-foreground text-sm">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">{card.value}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
