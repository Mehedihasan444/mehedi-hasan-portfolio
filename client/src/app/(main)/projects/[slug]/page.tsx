import type { Metadata } from "next";
import Link from "next/link";
import { getProjectBySlug, getProjects } from "@/lib/api-public";
import { ProjectDetailClient } from "./project-detail-client";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} | Mehedi Hasan`,
    description: project.description,
    openGraph: {
      title: `${project.title} - Project`,
      description: project.description,
      images: project.image ? [{ url: project.image }] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 pt-24">
        <Link
          href="/#projects"
          className="text-muted-foreground hover:text-emerald mb-8 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Projects
        </Link>
      </div>
      <ProjectDetailClient project={project} />
    </div>
  );
}
