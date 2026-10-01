import type { Metadata } from "next";
import Link from "next/link";
import { getProjectBySlug, getProjects, toStaticParams } from "@/lib/api-public";
import { SITE_URL } from "@/lib/constants";
import { ProjectDetailClient } from "./project-detail-client";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@/components/ui/icons";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return toStaticParams(
    projects.filter((p) => p.status === "published").slice(0, 20),
    "slug",
    "projects",
  );
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

  // Prev / next among published projects, ordered by `order`.
  let prev: { title: string; slug: string; image: string | null } | null = null;
  let next: { title: string; slug: string; image: string | null } | null = null;
  try {
    const all = (await getProjects())
      .filter((p) => p.status === "published")
      .sort((a, b) => a.order - b.order);
    const idx = all.findIndex((p) => p.slug === safeProject.slug);
    if (idx >= 0) {
      const p = all[idx - 1];
      const n = all[idx + 1];
      if (p) prev = { title: p.title, slug: p.slug, image: p.image };
      if (n) next = { title: n.title, slug: n.slug, image: n.image };
    }
  } catch {
    /* prev/next is progressive enhancement — page renders without it */
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 pt-24">
        <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-sm">
          <Link
            href="/projects"
            className="text-muted-foreground hover:text-emerald inline-flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Projects
          </Link>
          <span aria-hidden="true" className="text-white/20">
            /
          </span>
          <span className="max-w-55 truncate text-white/60">{safeProject.title}</span>
        </nav>
      </div>
      <ProjectDetailClient project={safeProject} prev={prev} next={next} />
    </div>
  );
}
