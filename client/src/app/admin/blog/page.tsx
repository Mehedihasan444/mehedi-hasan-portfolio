"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DataTable, AdminPageHeader, AdminFormModal } from "@/components/admin/data-table";
import { toast } from "sonner";
import type { BlogPost } from "@/lib/api-public";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const columns = [
  { key: "title", label: "Title" },
  {
    key: "published",
    label: "Published",
    render: (item: BlogPost) => (item.published ? "✓" : "—"),
  },
  {
    key: "createdAt",
    label: "Date",
    render: (item: BlogPost) => new Date(item.createdAt).toLocaleDateString(),
  },
];

export default function AdminBlogPage() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    tags: "",
    published: false,
  });

  const load = async (isCancelled?: () => boolean) => {
    try {
      const data = await api.get<BlogPost[]>("/blog");
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
    setForm({ title: "", slug: "", content: "", excerpt: "", tags: "", published: false });
    setModalOpen(true);
  };

  function parseJsonField(value: unknown): string {
    if (value === null || value === undefined) return "";
    if (Array.isArray(value)) return value.map(String).join(", ");
    if (typeof value !== "string") return "";
    if (value.trim() === "") return "";
    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String).join(", ");
      return value;
    } catch {
      return value;
    }
  }

  const openEdit = (item: BlogPost) => {
    setEditing(item);
    setForm({
      title: item.title,
      slug: item.slug,
      content: item.content || "",
      excerpt: item.excerpt || "",
      tags: parseJsonField(item.tags),
      published: item.published,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug.trim().toLowerCase();
    if (!SLUG_REGEX.test(slug)) {
      toast.error("Slug must be lowercase letters, numbers, and hyphens (e.g. my-post)");
      return;
    }
    try {
      const payload = {
        ...form,
        slug,
        tags: JSON.stringify(
          form.tags
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
        ),
      };
      if (editing) {
        await api.put(`/blog/${editing.id}`, payload);
        toast.success("Updated");
      } else {
        await api.post("/blog", payload);
        toast.success("Created");
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  const handleDelete = async (item: BlogPost) => {
    if (!confirm("Delete?")) return;
    try {
      await api.delete(`/blog/${item.id}`);
      toast.success("Deleted");
      await load();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Blog"
        action={
          <button
            onClick={openCreate}
            className="from-emerald to-teal rounded-lg bg-gradient-to-r px-4 py-2 text-sm font-medium text-white"
          >
            New Post
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
        title={editing ? "Edit Post" : "New Post"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
          />
          <input
            required
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
          />
          <input
            placeholder="Excerpt"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
          />
          <textarea
            required
            placeholder="Content (Markdown)"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
            rows={8}
          />
          <input
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
          />
          <label className="text-muted-foreground flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Published
          </label>
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
