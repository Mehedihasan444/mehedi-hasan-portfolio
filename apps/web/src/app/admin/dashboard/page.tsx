"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  const [settingIds, setSettingIds] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [projects, skills, experiences, messages, settings] = await Promise.all([
          api.get<unknown[]>("/projects"),
          api.get<unknown[]>("/skills"),
          api.get<unknown[]>("/experiences"),
          api.get<unknown[]>("/contact"),
          api.get<{ id: string; key: string; value: string }[]>("/site-settings"),
        ]);
        if (cancelled) return;
        setStats({
          projects: projects.length,
          skills: skills.length,
          experiences: experiences.length,
          messages: messages.length,
        });
        const map: Record<string, boolean> = {};
        const idMap: Record<string, string> = {};
        for (const s of settings) {
          if (s.key.startsWith("section_")) {
            map[s.key] = s.value === "true";
            idMap[s.key] = s.id;
          }
        }
        for (const key of sectionOrder) {
          if (map[key] === undefined) map[key] = true;
        }
        setToggles(map);
        setSettingIds(idMap);
      } catch {
        if (!cancelled) toast.error("Failed to load dashboard data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = async (key: string) => {
    const current = toggles[key] ?? true;
    const next = !current;
    setToggles((prev) => ({ ...prev, [key]: next }));
    setSaving(key);
    try {
      const existingId = settingIds[key];
      if (existingId) {
        await api.put(`/site-settings/${existingId}`, { value: String(next) });
      } else {
        const created = await api.post<{ id?: string } | null>("/site-settings", {
          key,
          value: String(next),
        });
        const newId = created?.id;
        if (newId) {
          setSettingIds((prev) => ({ ...prev, [key]: newId }));
        }
      }
      toast.success("Section updated");
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
          <Link
            key={card.label}
            href={card.href}
            className="glass glass-hover rounded-xl p-6 transition-all"
          >
            <p className="text-muted-foreground text-sm">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">{card.value}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-semibold text-white">Homepage Sections</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Enable or disable sections on the homepage
      </p>

      <div className="mt-6 space-y-1">
        {sectionOrder.map((key) => {
          const label = sectionLabels[key] ?? key;
          const isOn = toggles[key] ?? true;
          return (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border border-white/5 px-5 py-4 transition-colors hover:bg-white/[0.02]"
            >
              <span className="text-sm font-medium text-white">{label}</span>
              <button
                onClick={() => toggle(key)}
                disabled={saving === key}
                aria-label={`Toggle ${label} section`}
                aria-pressed={isOn}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                  isOn ? "bg-emerald-500" : "bg-white/10"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    isOn ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
