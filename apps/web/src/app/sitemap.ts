import type { MetadataRoute } from "next";
import { getProjects, getBlogPosts } from "@/lib/api-public";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  const [projects, posts] = await Promise.all([getProjects(), getBlogPosts()]);
  const projectEntries: MetadataRoute.Sitemap = projects
    .filter((p) => p.status === "published")
    .map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: project.updatedAt
        ? new Date(project.updatedAt)
        : project.createdAt
          ? new Date(project.createdAt)
          : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  const blogEntries: MetadataRoute.Sitemap = posts
    .filter((p) => p.published)
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt
        ? new Date(post.updatedAt)
        : post.createdAt
          ? new Date(post.createdAt)
          : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [
    {
      url: baseUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/projects`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...projectEntries,
    ...blogEntries,
  ];
}
