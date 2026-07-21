import { API_BASE } from "./constants";

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

export async function getBlogPosts(): Promise<FormattedBlogPost[]> {
  try {
    const res = await fetch(`${API_BASE}/blog`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data as BlogPost[]).map(formatBlogPost);
  } catch {
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<FormattedBlogPost | null> {
  try {
    const all = await getBlogPosts();
    return all.find((p) => p.slug === slug) ?? null;
  } catch {
    return null;
  }
}

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

export async function getEducation(): Promise<FormattedEducation[]> {
  try {
    const res = await fetch(`${API_BASE}/education`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data as Education[]).map((edu) => ({
      ...edu,
      tags: parseJsonArray(edu.tags),
    }));
  } catch {
    return [];
  }
}

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

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(`${API_BASE}/testimonials`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data as Testimonial[];
  } catch {
    return [];
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  try {
    const res = await fetch(`${API_BASE}/achievements`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data as Achievement[];
  } catch {
    return [];
  }
}

export async function getCertifications(): Promise<Certification[]> {
  try {
    const res = await fetch(`${API_BASE}/certifications`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data as Certification[];
  } catch {
    return [];
  }
}

export async function getExperiences(): Promise<FormattedExperience[]> {
  try {
    const res = await fetch(`${API_BASE}/experiences`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data as Experience[]).map((exp) => ({
      ...exp,
      tags: parseJsonArray(exp.tags),
    }));
  } catch {
    return [];
  }
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const res = await fetch(`${API_BASE}/skills`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data as Skill[];
  } catch {
    return [];
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
