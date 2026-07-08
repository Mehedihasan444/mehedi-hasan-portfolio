"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DataTable, AdminPageHeader, AdminFormModal } from "@/components/admin/data-table";
import { toast } from "sonner";

const columns = [
  { key: "name", label: "Name" },
  { key: "category", label: "Category" },
  {
    key: "proficiency",
    label: "Proficiency",
    render: (item: any) => `${item.proficiency}%`,
  },
];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    category: "Frontend",
    proficiency: 80,
    order: 0,
    icon: "",
  });

  const load = async () => {
    try {
      const data = await api.get<any[]>("./skills");
      setSkills(data);
    } catch {
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", category: "Frontend", proficiency: 80, order: 0, icon: "" });
    setModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      name: item.name,
      category: item.category,
      proficiency: item.proficiency,
      order: item.order,
      icon: item.icon || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`./skills/${editing.id}`, form);
        toast.success("Skill updated");
      } else {
        await api.post("./skills", form);
        toast.success("Skill created");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await api.delete(`./skills/${item.id}`);
      toast.success("Skill deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Skills"
        description="Manage your technical skills"
        action={
          <button
            onClick={openCreate}
            className="from-emerald to-teal rounded-lg bg-gradient-to-r px-4 py-2 text-sm font-medium text-white"
          >
            New Skill
          </button>
        }
      />
      <DataTable
        columns={columns}
        data={skills}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <AdminFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Skill" : "New Skill"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
          >
            <option>Frontend</option>
            <option>Backend</option>
            <option>Database</option>
            <option>Language</option>
            <option>Tools</option>
          </select>
          <div>
            <label className="text-muted-foreground text-sm">
              Proficiency: {form.proficiency}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={form.proficiency}
              onChange={(e) => setForm({ ...form, proficiency: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
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
