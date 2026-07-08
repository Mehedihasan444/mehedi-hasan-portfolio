const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string | null;
  techStack: string;
  liveUrl: string | null;
  githubUrl: string | null;
  image: string | null;
  images: string;
  featured: boolean;
  order: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return value
      ? value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  }
}

export function formatProject(project: Project) {
  return {
    ...project,
    techStack: parseJsonArray(project.techStack),
    images: parseJsonArray(project.images),
  };
}

export type FormattedProject = ReturnType<typeof formatProject>;

export async function getProjectBySlug(slug: string): Promise<FormattedProject | null> {
  try {
    const res = await fetch(`${API_BASE}/projects/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return formatProject(data.data);
  } catch {
    return null;
  }
}

export async function getProjects(): Promise<FormattedProject[]> {
  try {
    const res = await fetch(`${API_BASE}/projects`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data as Project[]).map(formatProject);
  } catch {
    return [];
  }
}
