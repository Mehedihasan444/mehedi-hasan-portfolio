"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DataTable, AdminPageHeader, AdminFormModal } from "@/components/admin/data-table";
import { toast } from "sonner";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "subject", label: "Subject" },
  { key: "read", label: "Read", render: (item: ContactMessage) => (item.read ? "✓" : "—") },
  {
    key: "createdAt",
    label: "Date",
    render: (item: ContactMessage) => new Date(item.createdAt).toLocaleDateString(),
  },
];

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const load = async () => {
    try {
      const data = await api.get<ContactMessage[]>("/contact");
      setMessages(data);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const handleDelete = async (item: ContactMessage) => {
    if (!confirm("Delete this message?")) return;
    try {
      await api.delete(`/contact/${item.id}`);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Failed");
    }
  };

  const handleMarkRead = async (item: ContactMessage) => {
    try {
      await api.put(`/contact/${item.id}`, { read: !item.read });
      load();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div>
      <AdminPageHeader title="Messages" description="Contact form submissions" />
      <DataTable columns={columns} data={messages} loading={loading} onDelete={handleDelete} />

      <AdminFormModal open={!!selected} onClose={() => setSelected(null)} title="Message Details">
        {selected && (
          <div className="space-y-4">
            <p className="text-sm text-white">
              <strong>From:</strong> {selected.name} ({selected.email})
            </p>
            <p className="text-sm text-white">
              <strong>Subject:</strong> {selected.subject || "No subject"}
            </p>
            <p className="text-muted-foreground text-sm">{selected.message}</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleMarkRead(selected);
                  setSelected(null);
                }}
                className="from-emerald to-teal rounded-lg bg-gradient-to-r px-4 py-2 text-sm text-white"
              >
                Mark as {selected.read ? "Unread" : "Read"}
              </button>
            </div>
          </div>
        )}
      </AdminFormModal>
    </div>
  );
}
