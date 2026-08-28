"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import type { FormattedProject } from "@/lib/api-public";

export function FeaturedCard({ project }: { project: FormattedProject }) {
  const year = project.createdAt ? new Date(project.createdAt).getFullYear().toString() : "";

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block h-full"
      aria-label={`View ${project.title} project`}
    >
      <div className="glass relative h-full min-h-[440px] overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20">
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={project.image || "/projects/marketsphere.webp"}
            alt={`${project.title} preview`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/40 to-transparent" />
          <span className="font-heading absolute right-4 top-4 select-none text-7xl font-bold text-white/[0.07]">
            01
          </span>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald/10 text-emerald rounded-full px-3 py-1 text-xs font-medium">
                  {project.status}
                </span>
                {year && <span className="text-muted-foreground text-xs">{year}</span>}
              </div>
              <h3 className="group-hover:text-gradient mt-3 text-xl font-bold text-white transition-all duration-300">
                {project.title}
              </h3>
            </div>
            <div className="text-muted-foreground group-hover:border-emerald/40 group-hover:text-emerald flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition-all duration-300 group-hover:scale-110">
              <ArrowUpRight size={16} />
            </div>
          </div>

          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            {project.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.techStack.map((t) => (
              <span
                key={t}
                className="text-muted-foreground rounded-full bg-white/5 px-3 py-1 text-xs transition-colors group-hover:bg-white/10 group-hover:text-white"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3">
            {project.githubUrl && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  window.open(project.githubUrl!, "_blank", "noopener,noreferrer");
                }}
                aria-label={`View ${project.title} on GitHub`}
                className="text-muted-foreground flex cursor-pointer items-center gap-1.5 text-xs transition-colors hover:text-white"
              >
                <GithubIcon />
                GitHub
              </button>
            )}
            {project.liveUrl && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  window.open(project.liveUrl!, "_blank", "noopener,noreferrer");
                }}
                aria-label={`View ${project.title} live demo`}
                className="text-muted-foreground hover:text-emerald flex cursor-pointer items-center gap-1.5 text-xs transition-colors"
              >
                <ExternalLink size={14} />
                Live Demo
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
