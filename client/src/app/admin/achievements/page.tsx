"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DataTable, AdminPageHeader, AdminFormModal } from "@/components/admin/data-table";
import { toast } from "sonner";
import type { Achievement } from "@/lib/api-public";

const columns = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
];

export default function AdminAchievementsPage() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [form, setForm] = useState({ title: "", description: "", icon: "" });

  const load = async (isCancelled?: () => boolean) => {
    try {
      const data = await api.get<Achievement[]>("/achievements");
      if (isCancelled?.()) return;
      setItems(data);
    } catch {
      if (isCancelled?.()) return;
      toast.error("Failed to load");
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

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", description: "", icon: "" });
    setModalOpen(true);
  };

  const openEdit = (item: Achievement) => {
    setEditing(item);
    setForm({ title: item.title, description: item.description || "", icon: item.icon || "" });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/achievements/${editing.id}`, form);
        toast.success("Updated");
      } else {
        await api.post("/achievements", form);
        toast.success("Created");
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  const handleDelete = async (item: Achievement) => {
    if (!confirm("Delete?")) return;
    try {
      await api.delete(`/achievements/${item.id}`);
      toast.success("Deleted");
      await load();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Achievements"
        action={
          <button
            onClick={openCreate}
            className="from-emerald to-teal rounded-lg bg-gradient-to-r px-4 py-2 text-sm font-medium text-white"
          >
            New Achievement
          </button>
        }
      />
      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
      <AdminFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Achievement" : "New Achievement"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
            rows={3}
          />
          <input
            placeholder="Icon name (Trophy, GitBranch, BookOpen, Zap, Code2, Coffee)"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
          />
          <button
            type="submit"
            className="from-emerald to-teal w-full rounded-lg bg-gradient-to-r px-4 py-2 text-sm font-medium text-white"
          >
            {editing ? "Update" : "Create"}
          </button>
        </form>
      </AdminFormModal>
    </div>
  );
}
