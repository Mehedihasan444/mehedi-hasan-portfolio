"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DataTable, AdminPageHeader, AdminFormModal } from "@/components/admin/data-table";
import { toast } from "sonner";

const columns = [
  { key: "role", label: "Role" },
  { key: "company", label: "Company" },
  { key: "location", label: "Location" },
  {
    key: "current",
    label: "Current",
    render: (item: any) => (item.current ? "✓" : "—"),
  },
];

export default function AdminExperiencesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    company: "",
    role: "",
    description: "",
    location: "",
    type: "full-time",
    startDate: "",
    endDate: "",
    current: false,
  });

  const load = async () => {
    try {
      const data = await api.get<any[]>("./experiences");
      setItems(data);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      company: "",
      role: "",
      description: "",
      location: "",
      type: "full-time",
      startDate: "",
      endDate: "",
      current: false,
    });
    setModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      company: item.company,
      role: item.role,
      description: item.description || "",
      location: item.location || "",
      type: item.type,
      startDate: item.startDate?.split("T")[0] || "",
      endDate: item.endDate?.split("T")[0] || "",
      current: item.current,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        startDate: new Date(form.startDate),
        endDate: form.endDate ? new Date(form.endDate) : null,
      };
      if (editing) {
        await api.put(`./experiences/${editing.id}`, payload);
        toast.success("Updated");
      } else {
        await api.post("./experiences", payload);
        toast.success("Created");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm("Delete?")) return;
    try {
      await api.delete(`./experiences/${item.id}`);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Experiences"
        action={
          <button
            onClick={openCreate}
            className="from-cyan to-purple rounded-lg bg-gradient-to-r px-4 py-2 text-sm font-medium text-white"
          >
            New Experience
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
        title={editing ? "Edit Experience" : "New Experience"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <input
            required
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-cyan/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
          />
          <input
            required
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-cyan/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-cyan/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
            rows={3}
          />
          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-cyan/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
          />
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="focus:border-cyan/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
          />
          <input
            type="date"
            placeholder="End Date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="focus:border-cyan/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
            disabled={form.current}
          />
          <label className="text-muted-foreground flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.current}
              onChange={(e) => setForm({ ...form, current: e.target.checked })}
            />
            Current position
          </label>
          <button
            type="submit"
            className="from-cyan to-purple w-full rounded-lg bg-gradient-to-r px-4 py-2 text-sm font-medium text-white"
          >
            {editing ? "Update" : "Create"}
          </button>
        </form>
      </AdminFormModal>
    </div>
  );
}
