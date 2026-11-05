"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DataTable, AdminPageHeader, AdminFormModal } from "@/components/admin/data-table";
import { toast } from "sonner";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  approved: boolean;
  createdAt: string;
}

const columns = [
  { key: "name", label: "Name" },
  {
    key: "message",
    label: "Message",
    render: (item: GuestbookEntry) =>
      item.message.length > 60 ? `${item.message.slice(0, 60)}…` : item.message,
  },
  {
    key: "approved",
    label: "Approved",
    render: (item: GuestbookEntry) => (item.approved ? "✓" : "—"),
  },
  {
    key: "createdAt",
    label: "Date",
    render: (item: GuestbookEntry) => new Date(item.createdAt).toLocaleDateString(),
  },
];

export default function AdminGuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<GuestbookEntry | null>(null);

  const load = async (isCancelled?: () => boolean) => {
    try {
      const data = await api.get<GuestbookEntry[]>("/guestbook/all");
      if (isCancelled?.()) return;
      setEntries(data);
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

  const handleDelete = async (item: GuestbookEntry) => {
    if (!confirm("Delete this entry?")) return;
    try {
      await api.delete(`/guestbook/${item.id}`);
      toast.success("Deleted");
      await load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleToggleApproved = async (item: GuestbookEntry) => {
    const next = !item.approved;
    setEntries((prev) => prev.map((m) => (m.id === item.id ? { ...m, approved: next } : m)));
    setSelected((prev) => (prev && prev.id === item.id ? { ...prev, approved: next } : prev));
    try {
      await api.put(`/guestbook/${item.id}`, { approved: next });
      toast.success(next ? "Approved — now visible publicly" : "Unapproved — hidden from public");
    } catch {
      setEntries((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, approved: item.approved } : m)),
      );
      setSelected((prev) =>
        prev && prev.id === item.id ? { ...prev, approved: item.approved } : prev,
      );
      toast.error("Failed to update entry");
    }
  };

  return (
    <div>
      <AdminPageHeader title="Guestbook" description="Moderate guestbook entries" />
      <DataTable
        columns={columns}
        data={entries}
        loading={loading}
        onDelete={handleDelete}
        onRowClick={setSelected}
      />

      <AdminFormModal open={!!selected} onClose={() => setSelected(null)} title="Entry Details">
        {selected && (
          <div className="space-y-4">
            <p className="text-sm text-white">
              <strong>From:</strong> {selected.name}
            </p>
            <p className="text-muted-foreground text-sm">{selected.message}</p>
            <p className="text-muted-foreground text-xs">
              {new Date(selected.createdAt).toLocaleString()}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  void handleToggleApproved(selected);
                }}
                aria-label={selected.approved ? "Unapprove entry" : "Approve entry"}
                className="from-emerald to-teal rounded-lg bg-gradient-to-r px-4 py-2 text-sm text-white"
              >
                {selected.approved ? "Unapprove" : "Approve"}
              </button>
            </div>
          </div>
        )}
      </AdminFormModal>
    </div>
  );
}
