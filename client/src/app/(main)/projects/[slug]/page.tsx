import type { Metadata } from "next";
import Link from "next/link";
import { getProjectBySlug, getProjects } from "@/lib/api-public";
import { SITE_URL } from "@/lib/constants";
import { ProjectDetailClient } from "./project-detail-client";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@/components/ui/icons";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects
      .filter((p) => p.status === "published")
      .slice(0, 20)
      .map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

function isSafeHttpUrl(u: string | null | undefined): u is string {
  if (!u) return false;
  try {
    const parsed = new URL(u, SITE_URL);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const clean = decodeURIComponent(slug || "").trim();
  if (!clean) return { title: "Project Not Found", robots: { index: false } };
  const project = await getProjectBySlug(clean);

  if (!project) {
    return { title: "Project Not Found", robots: { index: false } };
  }

  const url = `${SITE_URL}/projects/${project.slug}`;
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      title: project.title,
      description: project.description,
      url,
      images: project.image ? [{ url: project.image }] : [{ url: "/og-image.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.image ? [project.image] : ["/og-image.png"],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const clean = decodeURIComponent(slug || "").trim();
  if (!clean) notFound();
  const project = await getProjectBySlug(clean);

  if (!project) {
    notFound();
  }

  const safeProject = {
    ...project,
    liveUrl: isSafeHttpUrl(project.liveUrl) ? project.liveUrl : null,
    githubUrl: isSafeHttpUrl(project.githubUrl) ? project.githubUrl : null,
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 pt-24">
        <Link
          href="/projects"
          className="text-muted-foreground hover:text-emerald mb-8 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Projects
        </Link>
      </div>
      <ProjectDetailClient project={safeProject} />
    </div>
  );
}
