"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AdminPageHeader } from "@/components/admin/data-table";
import { toast } from "sonner";

type SettingRow = { id: string; key: string; value: string };

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [ids, setIds] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await api.get<SettingRow[]>("/site-settings?limit=100");
        if (cancelled) return;
        const map: Record<string, string> = {};
        const idMap: Record<string, string> = {};
        for (const s of data) {
          map[s.key] = s.value;
          idMap[s.key] = s.id;
        }
        setSettings(map);
        setIds(idMap);
      } catch {
        if (!cancelled) toast.error("Failed to load settings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(
        Object.entries(settings).map(async ([key, value]) => {
          const id = ids[key];
          if (id) {
            await api.put(`/site-settings/${id}`, { value });
          }
        }),
      );
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center py-20"
        role="status"
        aria-label="Loading settings"
      >
        <div className="border-emerald h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  const fields = [
    "site_name",
    "site_title",
    "site_description",
    "site_keywords",
    "email",
    "phone",
    "location",
    "available_for",
    "github_url",
    "linkedin_url",
    "twitter_url",
    "resume_url",
    "about_me",
  ];

  return (
    <div>
      <AdminPageHeader title="Settings" description="Manage site settings" />
      <div className="space-y-4">
        {fields.map((key) => (
          <div key={key}>
            <label
              htmlFor={`setting-${key}`}
              className="text-muted-foreground mb-1 block text-xs font-medium uppercase tracking-wider"
            >
              {key.replace(/_/g, " ")}
            </label>
            {key === "about_me" ? (
              <textarea
                id={`setting-${key}`}
                value={settings[key] || ""}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                className="focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
                rows={5}
              />
            ) : (
              <input
                id={`setting-${key}`}
                value={settings[key] || ""}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                className="focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
              />
            )}
          </div>
        ))}
        <button
          onClick={handleSave}
          disabled={saving}
          className="from-emerald to-teal rounded-lg bg-gradient-to-r px-6 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-teal-500/25 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
