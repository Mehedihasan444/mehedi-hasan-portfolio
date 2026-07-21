"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DataTable, AdminPageHeader, AdminFormModal } from "@/components/admin/data-table";
import { toast } from "sonner";

const columns = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "company", label: "Company" },
  { key: "rating", label: "Rating" },
];

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: "", role: "", company: "", content: "", avatar: "", rating: 5, order: 0,
  });

  const load = async () => {
    try {
      const data = await api.get<any[]>("/testimonials");
      setItems(data);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", role: "", company: "", content: "", avatar: "", rating: 5, order: 0 });
    setModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      name: item.name, role: item.role || "", company: item.company || "",
      content: item.content, avatar: item.avatar || "", rating: item.rating, order: item.order,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/testimonials/${editing.id}`, form);
        toast.success("Updated");
      } else {
        await api.post("/testimonials", form);
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
    try { await api.delete(`/testimonials/${item.id}`); toast.success("Deleted"); load(); }
    catch { toast.error("Failed"); }
  };

  return (
    <div>
      <AdminPageHeader title="Testimonials" action={
        <button onClick={openCreate} className="from-emerald to-teal rounded-lg bg-gradient-to-r px-4 py-2 text-sm font-medium text-white">New Testimonial</button>
      } />
      <DataTable columns={columns} data={items} loading={loading} onEdit={openEdit} onDelete={handleDelete} />
      <AdminFormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Testimonial" : "New Testimonial"}>
        <form onSubmit={handleSave} className="space-y-4">
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none" />
          <input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none" />
          <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none" />
          <textarea required placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none" rows={4} />
          <div className="flex gap-4">
            <input type="number" placeholder="Rating (1-5)" min={1} max={5} value={form.rating}
              onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) || 5 })}
              className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none" />
            <input type="number" placeholder="Order" value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
              className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none" />
          </div>
          <button type="submit" className="from-emerald to-teal w-full rounded-lg bg-gradient-to-r px-4 py-2 text-sm font-medium text-white">
            {editing ? "Update" : "Create"}
          </button>
        </form>
      </AdminFormModal>
    </div>
  );
}
