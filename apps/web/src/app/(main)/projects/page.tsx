import type { Metadata } from "next";
import { getProjects } from "@/lib/api-public";
import { ProjectsClient } from "./projects-client";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore my portfolio of web applications, tools, and developer resources.",
  openGraph: {
    title: "Projects | Mehedi Hasan",
    description: "Explore my portfolio of web applications and developer resources.",
  },
};

export default async function ProjectsPage() {
  let initial: Awaited<ReturnType<typeof getProjects>> = [];
  try {
    initial = await getProjects();
  } catch {
    initial = [];
  }
  return <ProjectsClient initialProjects={initial} />;
}
