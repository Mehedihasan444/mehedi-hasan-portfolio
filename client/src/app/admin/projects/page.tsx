"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import { DataTable, AdminPageHeader, AdminFormModal } from "@/components/admin/data-table";
import { toast } from "sonner";

const columns = [
  { key: "title", label: "Title" },
  { key: "status", label: "Status" },
  {
    key: "featured",
    label: "Featured",
    render: (item: any) => (item.featured ? "✓" : "—"),
  },
  {
    key: "createdAt",
    label: "Created",
    render: (item: any) => new Date(item.createdAt).toLocaleDateString(),
  },
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    techStack: "",
    liveUrl: "",
    githubUrl: "",
    image: "",
    images: "",
    order: 0,
    featured: false,
    status: "published",
  });

  const load = async () => {
    try {
      const data = await api.get<any[]>("/projects");
      setProjects(data);
    } catch {
      toast.error("Failed to load projects");
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
      title: "",
      slug: "",
      description: "",
      content: "",
      techStack: "",
      liveUrl: "",
      githubUrl: "",
      image: "",
      images: "",
      order: 0,
      featured: false,
      status: "published",
    });
    setModalOpen(true);
  };

  function parseJsonField(value: unknown): string {
    if (!value) return "";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.join(", ") : value;
      } catch {
        return value;
      }
    }
    return String(value);
  }

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      title: item.title,
      slug: item.slug,
      description: item.description || "",
      content: item.content || "",
      techStack: parseJsonField(item.techStack),
      liveUrl: item.liveUrl || "",
      githubUrl: item.githubUrl || "",
      image: item.image || "",
      images: parseJsonField(item.images),
      order: item.order ?? 0,
      featured: item.featured,
      status: item.status,
    });
    setModalOpen(true);
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);
    fd.append("folder", "portfolio/projects");

    try {
      setUploading(true);
      const result = await api.upload<{ secure_url: string }>("/upload", fd);
      setForm((prev) => ({ ...prev, image: result.secure_url }));
      toast.success("Thumbnail uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("images", f));
    fd.append("folder", "portfolio/projects/gallery");

    try {
      setUploading(true);
      const results = await api.upload<{ secure_url: string }[]>("/upload/multiple", fd);
      const newUrls = results.map((r) => r.secure_url).join(", ");
      setForm((prev) => ({
        ...prev,
        images: prev.images ? `${prev.images}, ${newUrls}` : newUrls,
      }));
      toast.success("Gallery images uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        techStack: JSON.stringify(
          form.techStack
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
        ),
        images: JSON.stringify(
          form.images
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
        ),
      };

      if (editing) {
        await api.put(`/projects/${editing.id}`, payload);
        toast.success("Project updated");
      } else {
        await api.post("/projects", payload);
        toast.success("Project created");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${item.id}`);
      toast.success("Project deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        description="Manage your portfolio projects"
        action={
          <button
            onClick={openCreate}
            className="from-emerald to-teal rounded-lg bg-gradient-to-r px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-teal-500/25"
          >
            New Project
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={projects}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <AdminFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Project" : "New Project"}
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
          <textarea
            required
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
            rows={3}
          />
          <input
            placeholder="Tech Stack (comma separated)"
            value={form.techStack}
            onChange={(e) => setForm({ ...form, techStack: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
          />
          <input
            placeholder="Live URL"
            value={form.liveUrl}
            onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
          />
          <input
            placeholder="GitHub URL"
            value={form.githubUrl}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
          />

          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
              Thumbnail Image
            </label>
            <div className="flex gap-2">
              <input
                placeholder="Or paste image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="placeholder:text-muted-foreground focus:border-emerald/50 flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
              />
              <label className="from-emerald to-teal flex cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r px-3 py-2 text-xs font-medium text-white transition-all hover:shadow-lg hover:shadow-teal-500/25">
                {uploading ? "..." : "Upload"}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
              </label>
            </div>
            {form.image && (
              <img
                src={form.image}
                alt="thumbnail preview"
                className="mt-1 h-16 w-28 rounded border border-white/10 object-cover"
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
              Gallery Images
            </label>
            <div className="flex gap-2">
              <input
                placeholder="Or paste comma-separated URLs"
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                className="placeholder:text-muted-foreground focus:border-emerald/50 flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
              />
              <label className="from-emerald to-teal flex cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r px-3 py-2 text-xs font-medium text-white transition-all hover:shadow-lg hover:shadow-teal-500/25">
                {uploading ? "..." : "Upload"}
                <input
                  ref={galleryInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <textarea
            placeholder="Content (markdown supported)"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
            rows={6}
          />
          <input
            type="number"
            placeholder="Order"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className="placeholder:text-muted-foreground focus:border-emerald/50 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none"
          />
          <label className="text-muted-foreground flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Featured
          </label>
          <button
            type="submit"
            disabled={uploading}
            className="from-emerald to-teal w-full rounded-lg bg-gradient-to-r px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {editing ? "Update" : "Create"}
          </button>
        </form>
      </AdminFormModal>
    </div>
  );
}
