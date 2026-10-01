"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { FormattedProject } from "@/lib/api-public";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { GalleryGrid } from "@/components/sections/project-detail/gallery-grid";
import { ProjectMarkdown } from "@/components/sections/project-detail/project-markdown";

type Neighbor = Pick<FormattedProject, "title" | "slug" | "image"> | null;

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function HeroMedia({ src, title }: { src: string | null; title: string }) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] shadow-[0_32px_80px_-24px_rgba(0,0,0,0.8)]">
      {/* glow behind */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(16,185,129,0.18),transparent_70%)] blur-2xl"
      />
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-emerald-500/10 via-[#0a0f1e] to-cyan-500/10">
        {!showFallback ? (
          <Image
            src={src as string}
            alt={`${title} — preview`}
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1152px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/40">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
              ◈
            </span>
            <p className="text-sm">Preview coming soon</p>
          </div>
        )}
        {/* bottom scrim for legibility of floating chips */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent"
        />
      </div>
      {/* floating chips */}
      <div className="absolute left-4 top-4 flex items-center gap-2">
        <span className="glass rounded-full px-3 py-1 text-xs font-medium text-white/85 backdrop-blur-md">
          Case study
        </span>
      </div>
    </div>
  );
}

export function ProjectDetailClient({
  project,
  prev,
  next,
}: {
  project: FormattedProject;
  prev: Neighbor;
  next: Neighbor;
}) {
  const year = (() => {
    try {
      return new Date(project.createdAt).getFullYear();
    } catch {
      return new Date().getFullYear();
    }
  })();

  const stats = [
    { label: "Technologies", value: String(project.techStack.length) },
    { label: "Screenshots", value: String(project.images.length) },
    { label: "Released", value: String(year) },
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-10 pt-6">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute right-[8%] top-24 h-56 w-56 rounded-full bg-cyan-500/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 font-medium uppercase tracking-[0.18em] text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Project
              </span>
              {project.featured && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 font-medium uppercase tracking-[0.18em] text-amber-200">
                  ★ Featured
                </span>
              )}
              <span className="text-white/40">
                {formatDate(project.createdAt)}
                {project.updatedAt && project.updatedAt !== project.createdAt
                  ? ` · Updated ${formatDate(project.updatedAt)}`
                  : ""}
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.75rem]">
              <span className="text-gradient">{project.title}</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="text-muted-foreground mt-5 max-w-3xl text-lg leading-relaxed">
              {project.description}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_32px_-8px_rgba(16,185,129,0.6)] transition-all hover:shadow-[0_8px_40px_-8px_rgba(16,185,129,0.8)]"
                >
                  Live Demo
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-hover inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/90 transition-colors"
                >
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Source Code
                </a>
              )}
              {/* stat pills */}
              <div className="ml-1 hidden items-center gap-2 sm:flex">
                {stats.map((s) => (
                  <span
                    key={s.label}
                    className="inline-flex items-baseline gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-white/60"
                  >
                    <span className="text-sm font-bold text-white">{s.value}</span>
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="mt-10">
            <HeroMedia src={project.image} title={project.title} />
          </ScrollReveal>
        </div>
      </section>

      {/* ── Body: main + sticky sidebar ──────────────────── */}
      <div className="mx-auto max-w-6xl px-6 pb-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* main column */}
          <div className="min-w-0">
            {project.techStack.length > 0 && (
              <section aria-label="Tech stack" className="pt-4">
                <ScrollReveal>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/50">
                    Built with
                  </h2>
                </ScrollReveal>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.techStack.map((t, i) => (
                    <ScrollReveal key={t} delay={Math.min(i * 0.02, 0.2)}>
                      <span className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-sm text-white/75 transition-colors hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-white">
                        <span className="h-1 w-1 rounded-full bg-emerald-400/70 transition-colors group-hover:bg-emerald-300" />
                        {t}
                      </span>
                    </ScrollReveal>
                  ))}
                </div>
              </section>
            )}

            {project.content && <ProjectMarkdown content={project.content} compact />}
          </div>

          {/* sidebar */}
          <aside className="lg:pt-4">
            <div className="space-y-5 lg:sticky lg:top-24">
              <ScrollReveal>
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
                  <div className="border-b border-white/10 px-5 py-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
                      Project info
                    </h3>
                  </div>
                  <dl className="space-y-4 px-5 py-5 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-white/45">Status</dt>
                      <dd className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium capitalize text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {project.status || "published"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-white/45">Published</dt>
                      <dd className="text-white/85">{formatDate(project.createdAt)}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-white/45">Last updated</dt>
                      <dd className="text-white/85">{formatDate(project.updatedAt)}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-white/45">Stack</dt>
                      <dd className="text-white/85">{project.techStack.length} tools</dd>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="grid grid-cols-2 gap-2">
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/8 inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:border-emerald-400/40 hover:bg-emerald-400/10"
                        >
                          ↗ Live site
                        </a>
                      ) : null}
                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:border-white/25 hover:bg-white/10"
                        >
                          〈〉 Code
                        </a>
                      ) : null}
                    </div>
                  </dl>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.05}>
                <div className="relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/15 via-transparent to-cyan-500/10 p-5">
                  <h3 className="text-base font-bold text-white">Have an idea like this?</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                    I build full-stack products end to end — from UI to deploy.
                  </p>
                  <Link
                    href="/#contact"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-[0_8px_32px_-8px_rgba(16,185,129,0.7)]"
                  >
                    Let&apos;s work together →
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </aside>
        </div>
      </div>

      <GalleryGrid images={project.images} title={project.title} />

      {/* ── Prev / Next ──────────────────────────────────── */}
      {(prev || next) && (
        <nav aria-label="More projects" className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
              >
                <span className="text-xs uppercase tracking-[0.2em] text-white/40">← Previous</span>
                <span className="mt-2 block truncate text-lg font-bold text-white group-hover:text-emerald-300">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-right transition-colors hover:border-white/20 hover:bg-white/[0.05]"
              >
                <span className="text-xs uppercase tracking-[0.2em] text-white/40">Next →</span>
                <span className="mt-2 block truncate text-lg font-bold text-white group-hover:text-emerald-300">
                  {next.title}
                </span>
              </Link>
            ) : null}
          </div>
        </nav>
      )}
    </>
  );
}
