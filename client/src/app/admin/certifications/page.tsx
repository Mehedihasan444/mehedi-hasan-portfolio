"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DataTable, AdminPageHeader, AdminFormModal } from "@/components/admin/data-table";
import { toast } from "sonner";

const columns = [
  { key: "title", label: "Title" },
  { key: "issuer", label: "Issuer" },
  {
    key: "date",
    label: "Date",
    render: (item: any) => (item.date ? new Date(item.date).getFullYear().toString() : "—"),
  },
];

export default function AdminCertificationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    title: "",
    issuer: "",
    description: "",
    url: "",
    image: "",
    date: "",
  });

  const load = async () => {
    try {
      const data = await api.get<any[]>("/certifications");
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
    setForm({ title: "", issuer: "", description: "", url: "", image: "", date: "" });
    setModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      title: item.title,
      issuer: item.issuer,
      description: item.description || "",
      url: item.url || "",
      image: item.image || "",
      date: item.date?.split("T")[0] || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        date: form.date ? new Date(form.date).toISOString() : null,
        image: form.image || null,
      };
      if (editing) {
        await api.put(`/certifications/${editing.id}`, payload);
        toast.success("Updated");
      } else {
        await api.post("/certifications", payload);
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
      await api.delete(`/certifications/${item.id}`);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div>
      <AdminPageHeader title="Certifications" action={
        <button onClick={openCreate}
          className="from-emerald to-teal rounded-lg bg-gradient-to-r px-4 py-2 text-sm font-medium text-white">
          New Certification
        </button>
      } />
      <DataTable columns={columns} data={items} loading={loading} onEdit={openEdit} onDelete={handleDelete} />
      <AdminFormModal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? "Edit Certification" : "New Certification"}>
        <form onSubmit={handleSave} className="space-y-4">
          <input required placeholder="Title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none" />
          <input required placeholder="Issuer" value={form.issuer}
            onChange={(e) => setForm({ ...form, issuer: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none" />
          <textarea placeholder="Description" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none" rows={3} />
          <input placeholder="Credential URL" value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none" />
          <input type="date" value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none" />
          <button type="submit"
            className="from-emerald to-teal w-full rounded-lg bg-gradient-to-r px-4 py-2 text-sm font-medium text-white">
            {editing ? "Update" : "Create"}
          </button>
        </form>
      </AdminFormModal>
    </div>
  );
}
