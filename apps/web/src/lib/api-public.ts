import { cache } from "react";
import { API_BASE } from "./constants";

/**
 * Slug returned by generateStaticParams when the API has nothing to give at
 * build time.
 *
 * Cache Components requires generateStaticParams to return at least one param
 * so it can validate that a route prerenders a non-empty static shell; an empty
 * array fails the build. That is a problem here because the web app fetches
 * from a separate API that is usually not running while the web app builds
 * (Vercel, CI, or a plain `pnpm --filter web build`).
 *
 * Emitting this placeholder keeps the build green. It resolves to notFound() in
 * the page, so it produces no real route, and because dynamicParams defaults to
 * true every genuine slug is still rendered on first request and then cached by
 * ISR. See https://nextjs.org/docs/messages/empty-generate-static-params
 */
export const BUILD_PLACEHOLDER_SLUG = "__build_placeholder__";

/**
 * Turns a fetched collection into generateStaticParams output.
 *
 * Returns real params when there is data, and the placeholder otherwise. Set
 * `source` to the collection name so an empty result warns loudly at build time
 * - an empty API response is otherwise indistinguishable from "no content yet".
 */
export function toStaticParams<T extends Record<string, unknown>>(
  items: T[],
  key: keyof T & string,
  source: string,
): Record<string, unknown>[] {
  if (items.length > 0) return items.map((item) => ({ [key]: item[key] }));
  console.warn(
    `[build] ${source}: no rows available while prerendering. Emitting the placeholder slug, ` +
      `so these routes will render on first request instead of at build time. ` +
      `Check that the API is reachable at ${API_BASE}.`,
  );
  return [{ [key]: BUILD_PLACEHOLDER_SLUG }];
}

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

// Trims, drops empties, and removes duplicates (case-insensitive, first
// occurrence wins) — user-entered comma lists like "Zod, React, Zod" must not
// produce duplicate React keys downstream.
function dedupeStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const v = raw.trim();
    if (!v) continue;
    const key = v.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value))
    return dedupeStrings(value.filter((v): v is string => typeof v === "string"));
  if (typeof value !== "string") return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? dedupeStrings(parsed.filter((v): v is string => typeof v === "string"))
      : [];
  } catch {
    return value ? dedupeStrings(value.split(",")) : [];
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function asArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

export function formatProject(project: Project) {
  return {
    ...project,
    techStack: parseJsonArray(project.techStack),
    images: parseJsonArray(project.images),
  };
}

export type FormattedProject = ReturnType<typeof formatProject>;

export const getProjectBySlug = cache(async (slug: string): Promise<FormattedProject | null> => {
  const clean = slug.trim();
  if (!clean) return null;
  try {
    const res = await fetch(`${API_BASE}/projects/slug/${encodeURIComponent(clean)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!isRecord(data) || !isRecord(data.data)) return null;
    return formatProject(data.data as unknown as Project);
  } catch {
    return null;
  }
});

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  tags: string;
  image: string | null;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

function formatBlogPost(post: BlogPost) {
  return {
    ...post,
    tags: parseJsonArray(post.tags),
  };
}

export type FormattedBlogPost = ReturnType<typeof formatBlogPost>;

export const getBlogPosts = cache(async (): Promise<FormattedBlogPost[]> => {
  try {
    const res = await fetch(`${API_BASE}/blog`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    if (!isRecord(data)) return [];
    return asArray<BlogPost>(data.data).map(formatBlogPost);
  } catch {
    return [];
  }
});

export const getBlogPostBySlug = cache(async (slug: string): Promise<FormattedBlogPost | null> => {
  const clean = slug.trim();
  if (!clean) return null;
  try {
    const res = await fetch(`${API_BASE}/blog/slug/${encodeURIComponent(clean)}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data: unknown = await res.json();
      if (isRecord(data) && isRecord(data.data)) {
        return formatBlogPost(data.data as unknown as BlogPost);
      }
    }
  } catch {
    /* fall through to list scan */
  }
  try {
    const all = await getBlogPosts();
    return all.find((p) => p.slug === clean) ?? null;
  } catch {
    return null;
  }
});

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  proficiency: number;
  order: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  location: string | null;
  type: string;
  current: boolean;
  tags: string;
}

export type FormattedExperience = Omit<Experience, "tags"> & { tags: string[] };

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  location: string | null;
  gpa: string | null;
  tags: string;
}

export type FormattedEducation = Omit<Education, "tags"> & { tags: string[] };

export const getEducation = cache(async (): Promise<FormattedEducation[]> => {
  try {
    const res = await fetch(`${API_BASE}/education`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    if (!isRecord(data)) return [];
    return asArray<Education>(data.data).map((edu) => ({
      ...edu,
      tags: parseJsonArray(edu.tags),
    }));
  } catch {
    return [];
  }
});

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  url: string | null;
  date: string | null;
  description: string | null;
  image: string | null;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  avatar: string | null;
  rating: number;
  featured: boolean;
  order: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  icon: string | null;
}

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  try {
    const res = await fetch(`${API_BASE}/testimonials`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    if (!isRecord(data)) return [];
    return asArray<Testimonial>(data.data);
  } catch {
    return [];
  }
});

export const getAchievements = cache(async (): Promise<Achievement[]> => {
  try {
    const res = await fetch(`${API_BASE}/achievements`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    if (!isRecord(data)) return [];
    return asArray<Achievement>(data.data);
  } catch {
    return [];
  }
});

export const getCertifications = cache(async (): Promise<Certification[]> => {
  try {
    const res = await fetch(`${API_BASE}/certifications`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    if (!isRecord(data)) return [];
    return asArray<Certification>(data.data);
  } catch {
    return [];
  }
});

export const getExperiences = cache(async (): Promise<FormattedExperience[]> => {
  try {
    const res = await fetch(`${API_BASE}/experiences`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    if (!isRecord(data)) return [];
    return asArray<Experience>(data.data).map((exp) => ({
      ...exp,
      tags: parseJsonArray(exp.tags),
    }));
  } catch {
    return [];
  }
});

export const getSkills = cache(async (): Promise<Skill[]> => {
  try {
    const res = await fetch(`${API_BASE}/skills`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    if (!isRecord(data)) return [];
    return asArray<Skill>(data.data);
  } catch {
    return [];
  }
});

export const getProjects = cache(async (): Promise<FormattedProject[]> => {
  try {
    const res = await fetch(`${API_BASE}/projects`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    if (!isRecord(data)) return [];
    return asArray<Project>(data.data).map(formatProject);
  } catch {
    return [];
  }
});
