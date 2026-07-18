import type { Metadata } from "next";
import Link from "next/link";
import { getProjectBySlug } from "@/lib/api-public";
import { ProjectDetailClient } from "./project-detail-client";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@/components/ui/icons";

type Props = {
  params: Promise<{ slug: string }>;
};

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
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Projects
        </Link>
      </div>
      <ProjectDetailClient project={project} />
    </div>
  );
}
