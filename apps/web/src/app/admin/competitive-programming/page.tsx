"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DataTable, AdminPageHeader, AdminFormModal } from "@/components/admin/data-table";
import { toast } from "sonner";
import type { CompetitiveProfile, CompetitiveStat } from "@/lib/api-public";

const inputCls =
  "placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none";

const profileColumns = [
  { key: "platform", label: "Platform" },
  { key: "stat", label: "Stat" },
  { key: "badge", label: "Badge" },
  {
    key: "order",
    label: "Order",
    render: (item: CompetitiveProfile) => String(item.order),
  },
];

const statColumns = [
  { key: "value", label: "Value" },
  { key: "label", label: "Label" },
  {
    key: "order",
    label: "Order",
    render: (item: CompetitiveStat) => String(item.order),
  },
];

const emptyProfile = {
  platform: "",
  handle: "",
  url: "",
  stat: "",
  detail: "",
  badge: "",
  order: 0,
};
const emptyStat = { value: "", label: "", order: 0 };

export default function AdminCompetitiveProgrammingPage() {
  const [profiles, setProfiles] = useState<CompetitiveProfile[]>([]);
  const [stats, setStats] = useState<CompetitiveStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileModal, setProfileModal] = useState(false);
  const [statModal, setStatModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<CompetitiveProfile | null>(null);
  const [editingStat, setEditingStat] = useState<CompetitiveStat | null>(null);
  const [profileForm, setProfileForm] = useState(emptyProfile);
  const [statForm, setStatForm] = useState(emptyStat);

  const load = async (isCancelled?: () => boolean) => {
    try {
      const [p, s] = await Promise.all([
        api.get<CompetitiveProfile[]>("/competitive-profiles"),
        api.get<CompetitiveStat[]>("/competitive-stats"),
      ]);
      if (isCancelled?.()) return;
      setProfiles([...p].sort((a, b) => a.order - b.order));
      setStats([...s].sort((a, b) => a.order - b.order));
    } catch {
      if (isCancelled?.()) return;
      toast.error("Failed to load competitive programming data");
    } finally {
      if (!isCancelled?.()) setLoading(false);
    }
  };
  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load
    load(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, []);

  const openNewProfile = () => {
    setEditingProfile(null);
    setProfileForm(emptyProfile);
    setProfileModal(true);
  };

  const openEditProfile = (item: CompetitiveProfile) => {
    setEditingProfile(item);
    setProfileForm({
      platform: item.platform,
      handle: item.handle,
      url: item.url || "",
      stat: item.stat,
      detail: item.detail || "",
      badge: item.badge || "",
      order: item.order,
    });
    setProfileModal(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.platform.trim()) {
      toast.error("Platform is required");
      return;
    }
    try {
      if (editingProfile) {
        await api.put(`/competitive-profiles/${editingProfile.id}`, profileForm);
        toast.success("Profile updated");
      } else {
        await api.post("/competitive-profiles", profileForm);
        toast.success("Profile created");
      }
      setProfileModal(false);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const handleDeleteProfile = async (item: CompetitiveProfile) => {
    if (!confirm(`Delete the ${item.platform} profile?`)) return;
    try {
      await api.delete(`/competitive-profiles/${item.id}`);
      toast.success("Profile deleted");
      await load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const openNewStat = () => {
    setEditingStat(null);
    setStatForm(emptyStat);
    setStatModal(true);
  };

  const openEditStat = (item: CompetitiveStat) => {
    setEditingStat(item);
    setStatForm({ value: item.value, label: item.label, order: item.order });
    setStatModal(true);
  };

  const handleSaveStat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statForm.value.trim() || !statForm.label.trim()) {
      toast.error("Value and label are required");
      return;
    }
    try {
      if (editingStat) {
        await api.put(`/competitive-stats/${editingStat.id}`, statForm);
        toast.success("Stat updated");
      } else {
        await api.post("/competitive-stats", statForm);
        toast.success("Stat created");
      }
      setStatModal(false);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const handleDeleteStat = async (item: CompetitiveStat) => {
    if (!confirm(`Delete the "${item.label}" stat?`)) return;
    try {
      await api.delete(`/competitive-stats/${item.id}`);
      toast.success("Stat deleted");
      await load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-12">
      <div>
        <AdminPageHeader
          title="Competitive Programming"
          description="Platform cards shown in the problem-solving section"
          action={
            <button
              onClick={openNewProfile}
              className="from-emerald to-teal rounded-lg bg-gradient-to-r px-4 py-2 text-sm font-medium text-white"
            >
              New Profile
            </button>
          }
        />
        <DataTable
          columns={profileColumns}
          data={profiles}
          loading={loading}
          onEdit={openEditProfile}
          onDelete={handleDeleteProfile}
        />
      </div>

      <div>
        <AdminPageHeader
          title="Headline Stats"
          description="Metric strip above the platform cards"
          action={
            <button
              onClick={openNewStat}
              className="from-emerald to-teal rounded-lg bg-gradient-to-r px-4 py-2 text-sm font-medium text-white"
            >
              New Stat
            </button>
          }
        />
        <DataTable
          columns={statColumns}
          data={stats}
          loading={loading}
          onEdit={openEditStat}
          onDelete={handleDeleteStat}
        />
      </div>

      <AdminFormModal
        open={profileModal}
        onClose={() => setProfileModal(false)}
        title={editingProfile ? "Edit Profile" : "New Profile"}
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <input
            required
            list="cp-platforms"
            placeholder="Platform (e.g. LeetCode)"
            value={profileForm.platform}
            onChange={(e) => setProfileForm({ ...profileForm, platform: e.target.value })}
            className={inputCls}
          />
          <datalist id="cp-platforms">
            {[
              "LeetCode",
              "Codeforces",
              "CodeChef",
              "HackerRank",
              "AtCoder",
              "LightOJ",
              "HackerEarth",
              "GeeksforGeeks",
            ].map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
          <input
            placeholder="Handle (e.g. @Mehedihasan444)"
            value={profileForm.handle}
            onChange={(e) => setProfileForm({ ...profileForm, handle: e.target.value })}
            className={inputCls}
          />
          <input
            placeholder="Profile URL"
            type="url"
            value={profileForm.url}
            onChange={(e) => setProfileForm({ ...profileForm, url: e.target.value })}
            className={inputCls}
          />
          <input
            placeholder="Headline stat (e.g. 500+ solved)"
            value={profileForm.stat}
            onChange={(e) => setProfileForm({ ...profileForm, stat: e.target.value })}
            className={inputCls}
          />
          <input
            placeholder="Detail (e.g. Rated contests & problem sets)"
            value={profileForm.detail}
            onChange={(e) => setProfileForm({ ...profileForm, detail: e.target.value })}
            className={inputCls}
          />
          <input
            placeholder="Badge (e.g. Specialist)"
            value={profileForm.badge}
            onChange={(e) => setProfileForm({ ...profileForm, badge: e.target.value })}
            className={inputCls}
          />
          <div>
            <label className="text-muted-foreground text-sm">Order: {profileForm.order}</label>
            <input
              type="number"
              value={profileForm.order}
              onChange={(e) =>
                setProfileForm({ ...profileForm, order: Number(e.target.value) || 0 })
              }
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            className="from-emerald to-teal w-full rounded-lg bg-gradient-to-r px-4 py-2 text-sm font-medium text-white"
          >
            {editingProfile ? "Update" : "Create"}
          </button>
        </form>
      </AdminFormModal>

      <AdminFormModal
        open={statModal}
        onClose={() => setStatModal(false)}
        title={editingStat ? "Edit Stat" : "New Stat"}
      >
        <form onSubmit={handleSaveStat} className="space-y-4">
          <input
            required
            placeholder="Value (e.g. 800+)"
            value={statForm.value}
            onChange={(e) => setStatForm({ ...statForm, value: e.target.value })}
            className={inputCls}
          />
          <input
            required
            placeholder="Label (e.g. Problems Solved)"
            value={statForm.label}
            onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
            className={inputCls}
          />
          <div>
            <label className="text-muted-foreground text-sm">Order: {statForm.order}</label>
            <input
              type="number"
              value={statForm.order}
              onChange={(e) => setStatForm({ ...statForm, order: Number(e.target.value) || 0 })}
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            className="from-emerald to-teal w-full rounded-lg bg-gradient-to-r px-4 py-2 text-sm font-medium text-white"
          >
            {editingStat ? "Update" : "Create"}
          </button>
        </form>
      </AdminFormModal>
    </div>
  );
}
