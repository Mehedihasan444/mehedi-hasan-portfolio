"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AdminPageHeader } from "@/components/admin/data-table";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await api.get<Record<string, string>[]>("/site-settings");
      const map: Record<string, string> = {};
      data.forEach((s: Record<string, string>) => {
        map[s.key] = s.value;
      });
      setSettings(map);
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const handleSave = async () => {
    try {
      for (const [key, value] of Object.entries(settings)) {
        const existing = await api.get<Record<string, string>[]>("/site-settings");
        const found = existing.find((s: Record<string, string>) => s.key === key);
        if (found) {
          await api.put(`/site-settings/${found.id}`, { value });
        }
      }
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
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
            <label className="text-muted-foreground mb-1 block text-xs font-medium uppercase tracking-wider">
              {key.replace(/_/g, " ")}
            </label>
            {key === "about_me" ? (
              <textarea
                value={settings[key] || ""}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                className="focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
                rows={5}
              />
            ) : (
              <input
                value={settings[key] || ""}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                className="focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
              />
            )}
          </div>
        ))}
        <button
          onClick={handleSave}
          className="from-emerald to-teal rounded-lg bg-gradient-to-r px-6 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-teal-500/25"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
