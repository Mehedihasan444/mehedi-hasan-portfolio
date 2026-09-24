"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { GithubIcon } from "@/components/ui/icons";
import type { FormattedProject } from "@/lib/api-public";

function isSafeHttpUrl(u: string | null | undefined): boolean {
  if (!u) return false;
  try {
    const parsed = new URL(u);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function WorkTrack({ projects }: { projects: FormattedProject[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Pinned horizontal scroll on desktop only — mirrors the reference work
  // section (GSAP ScrollTrigger pin + scrub). Mobile and reduced-motion fall
  // back to the plain vertical stack via CSS.
  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" aria-label="Selected work" className="relative">
      <div className="mx-auto max-w-7xl px-6 pt-32 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-5 lg:z-10 lg:pt-16">
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-[0.3em]">
          Portfolio
        </p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-5xl">
          My <span className="text-gradient">Projects</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed sm:text-lg">
          A selection of projects that showcase my skills and passion for building exceptional
          digital experiences — scroll to travel through them.
        </p>
      </div>

      <div
        ref={trackRef}
        className="mt-8 flex flex-col gap-20 px-6 pb-24 md:mt-20 lg:w-max lg:flex-row lg:items-center lg:gap-0 lg:px-0 lg:pb-0"
      >
        {projects.map((project, i) => (
          <WorkBox key={project.slug} project={project} index={i} first={i === 0} />
        ))}

        <div className="flex items-center justify-center lg:h-screen lg:w-[60vw] lg:shrink-0 lg:pb-[12vh] lg:pr-[8vw]">
          <div className="glass w-full max-w-md rounded-2xl p-10 text-center">
            <h3 className="text-2xl font-bold text-white sm:text-3xl">Want to see more?</h3>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
              Explore all of my projects and creations
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <Link
                href="/projects"
                className="from-emerald to-teal group inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-teal-500/25"
              >
                See All Works
                <ArrowRight
                  size={14}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="https://github.com/Mehedihasan444"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground text-xs transition-colors hover:text-white"
              >
                or browse GitHub directly
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkBox({
  project,
  index,
  first,
}: {
  project: FormattedProject;
  index: number;
  first: boolean;
}) {
  const num = String(index + 1).padStart(2, "0");
  const detailHref = `/projects/${project.slug}`;
  const liveOk = isSafeHttpUrl(project.liveUrl);
  const gitOk = isSafeHttpUrl(project.githubUrl);

  return (
    <article
      className={`grid items-center gap-8 lg:h-screen lg:w-[86vw] lg:shrink-0 lg:grid-cols-2 lg:gap-14 lg:py-24 lg:pb-[12vh] lg:pr-[6vw] ${
        first ? "lg:pl-[6vw]" : ""
      }`}
      aria-label={`${project.title} — project ${num}`}
    >
      <div>
        <div className="flex items-start gap-5">
          <span
            aria-hidden="true"
            className="font-heading text-gradient select-none text-6xl font-bold leading-none sm:text-7xl"
          >
            {num}
          </span>
          <div>
            <h3 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              <Link href={detailHref} className="transition-colors hover:text-emerald-300">
                {project.title}
              </Link>
            </h3>
            <p className="text-muted-foreground mt-2 text-xs font-medium uppercase tracking-[0.2em]">
              {project.techStack.slice(0, 3).join(" / ") || "Web Application"}
            </p>
          </div>
        </div>

        <h4 className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
          Tools and features
        </h4>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
          {project.techStack.join(", ")}
        </p>
        <p className="text-muted-foreground mt-4 line-clamp-3 text-sm leading-relaxed">
          {project.description}
        </p>

        <div className="mt-6 flex items-center gap-4">
          <Link
            href={detailHref}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-emerald-300"
          >
            Case Study
            <ArrowUpRight
              size={15}
              aria-hidden="true"
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
          {gitOk && (
            <a
              href={project.githubUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} on GitHub`}
              className="text-muted-foreground flex items-center gap-1.5 text-xs transition-colors hover:text-white"
            >
              <GithubIcon />
              GitHub
            </a>
          )}
          {liveOk && (
            <a
              href={project.liveUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} live demo`}
              className="text-muted-foreground flex items-center gap-1.5 text-xs transition-colors hover:text-emerald-300"
            >
              <ArrowUpRight size={14} aria-hidden="true" />
              Live Demo
            </a>
          )}
        </div>
      </div>

      <Link
        href={detailHref}
        aria-label={`Open ${project.title} case study`}
        className="group relative block aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 43vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            aria-hidden="true"
            className="from-emerald/10 to-teal/10 absolute inset-0 bg-gradient-to-br"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#050810]/50 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-30"
        />
        <span
          aria-hidden="true"
          className="text-muted-foreground group-hover:border-emerald/40 absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#050810]/70 backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-300"
        >
          <ArrowUpRight size={16} />
        </span>
      </Link>
    </article>
  );
}
