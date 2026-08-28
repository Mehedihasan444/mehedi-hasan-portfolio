"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

const sectionLabels: Record<string, string> = {
  section_hero: "Hero",
  section_about: "About",
  section_skills: "Skills",
  section_experience: "Experience",
  section_projects: "Projects",
  section_education: "Education",
  section_certifications: "Certifications",
  section_achievements: "Achievements",
  section_github: "GitHub",
  section_testimonials: "Testimonials",
  section_blog: "Blog",
  section_contact: "Contact",
};

const sectionOrder = Object.keys(sectionLabels);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experiences: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<string | null>(null);
  useEffect(() => {
    async function load() {
      try {
        const [projects, skills, experiences, messages, settings] = await Promise.all([
          api.get<unknown[]>("/projects"),
          api.get<unknown[]>("/skills"),
          api.get<unknown[]>("/experiences"),
          api.get<unknown[]>("/contact"),
          api.get<{ id: string; key: string; value: string }[]>("/site-settings"),
        ]);
        setStats({
          projects: projects.length,
          skills: skills.length,
          experiences: experiences.length,
          messages: messages.length,
        });
        const map: Record<string, boolean> = {};
        for (const s of settings) {
          if (s.key.startsWith("section_")) {
            map[s.key] = s.value === "true";
          }
        }
        for (const key of sectionOrder) {
          if (map[key] === undefined) map[key] = true;
        }
        setToggles(map);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggle = async (key: string) => {
    const next = !toggles[key];
    setToggles((prev) => ({ ...prev, [key]: next }));
    setSaving(key);
    try {
      const all = await api.get<{ id: string; key: string; value: string }[]>("/site-settings");
      const existing = all.find((s) => s.key === key);
      if (existing) {
        await api.put(`/site-settings/${existing.id}`, { value: String(next) });
      } else {
        await api.post("/site-settings", { key, value: String(next) });
      }
    } catch {
      setToggles((prev) => ({ ...prev, [key]: !next }));
      toast.error("Failed to update section");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="border-emerald h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  const cards = [
    { label: "Projects", value: stats.projects, href: "/admin/projects" },
    { label: "Skills", value: stats.skills, href: "/admin/skills" },
    { label: "Experiences", value: stats.experiences, href: "/admin/experiences" },
    { label: "Messages", value: stats.messages, href: "/admin/messages" },
  ];

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

      <h2 className="mt-12 text-xl font-semibold text-white">Homepage Sections</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Enable or disable sections on the homepage
      </p>

      <div className="mt-6 space-y-1">
        {sectionOrder.map((key) => (
          <div
            key={key}
            className="flex items-center justify-between rounded-lg border border-white/5 px-5 py-4 transition-colors hover:bg-white/[0.02]"
          >
            <span className="text-sm font-medium text-white">{sectionLabels[key]}</span>
            <button
              onClick={() => toggle(key)}
              disabled={saving === key}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                toggles[key] ? "bg-emerald-500" : "bg-white/10"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  toggles[key] ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
