"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import type { FormattedProject } from "@/lib/api-public";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { DissolveRevealWrapper } from "@/components/3d/dissolve-reveal-wrapper";
import { GalleryGrid } from "@/components/sections/project-detail/gallery-grid";
import { ProjectMarkdown } from "@/components/sections/project-detail/project-markdown";

export function ProjectDetailClient({ project }: { project: FormattedProject }) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroImg = heroRef.current?.querySelector(".hero-image");
      if (heroImg) {
        gsap.fromTo(
          heroImg,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={heroRef} className="relative px-6 pb-16 pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <ScrollReveal>
                <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
                  Project
                </p>
              </ScrollReveal>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="text-gradient">{project.title}</span>
              </h1>

              <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                {project.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {project.techStack.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <MagneticButton>
                      <span className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        Live Demo
                      </span>
                    </MagneticButton>
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <MagneticButton>
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        Source Code
                      </span>
                    </MagneticButton>
                  </a>
                )}
              </div>
            </div>

            {project.image && (
              <div className="hero-image h-80 overflow-hidden rounded-2xl md:h-96 lg:h-[28rem]">
                <DissolveRevealWrapper imageSrc={project.image} className="h-full w-full" />
              </div>
            )}
          </div>
        </div>
      </section>

      <GalleryGrid images={project.images} />

      {project.content && <ProjectMarkdown content={project.content} />}
    </>
  );
}
