"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { FormattedProject } from "@/lib/api-public";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { DissolveRevealWrapper } from "@/components/3d/dissolve-reveal-wrapper";

gsap.registerPlugin(ScrollTrigger);

function Lightbox({
  images,
  index,
  onClose,
}: {
  images: string[];
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrent((i) => (i > 0 ? i - 1 : i));
      if (e.key === "ArrowRight") setCurrent((i) => (i < images.length - 1 ? i + 1 : i));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [images, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-6 top-6 text-2xl text-white/70 transition-colors hover:text-white"
      >
        ✕
      </button>

      {images.length > 1 && current > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrent((i) => i - 1);
          }}
          className="absolute left-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-all hover:bg-white/20"
        >
          ‹
        </button>
      )}

      {images.length > 1 && current < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrent((i) => i + 1);
          }}
          className="absolute right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-all hover:bg-white/20"
        >
          ›
        </button>
      )}

      <div
        className="flex h-full w-full items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex flex-col items-center">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={images[current]}
              alt={`Gallery ${current + 1}`}
              className="max-h-[80vh] max-w-full object-contain"
            />
          </div>
          {images.length > 1 && (
            <p className="mt-4 text-sm text-white/50">
              {current + 1} / {images.length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function GalleryGrid({ images }: { images: string[] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gridRef.current?.querySelectorAll(".gallery-item");
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, gridRef);

    return () => ctx.revert();
  }, []);

  if (images.length === 0) return null;

  return (
    <div className="mx-auto mt-16 max-w-7xl px-6">
      <ScrollReveal>
        <h2 className="text-gradient mb-8 text-2xl font-bold">Gallery</h2>
      </ScrollReveal>

      <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => {
              setLightboxIndex(i);
              setLightboxOpen(true);
            }}
            className="gallery-item group relative aspect-video overflow-hidden rounded-xl"
          >
            <img
              src={src}
              alt={`Screenshot ${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <Lightbox images={images} index={lightboxIndex} onClose={() => setLightboxOpen(false)} />
      )}
    </div>
  );
}

export function ProjectDetailClient({ project }: { project: FormattedProject }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero image reveal
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

      // Content reveal
      const contentEls = contentRef.current?.querySelectorAll(".content-reveal");
      if (contentEls) {
        gsap.fromTo(
          contentEls,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, [heroRef, contentRef]);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Hero section with image reveal */}
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

      {/* Gallery */}
      <GalleryGrid images={project.images} />

      {/* Content */}
      {project.content && (
        <section ref={contentRef} className="relative px-6 py-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="from-emerald/5 via-teal/5 absolute left-1/4 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-br to-transparent blur-[120px]" />
          </div>
          <div className="mx-auto max-w-4xl">
            <ScrollReveal>
              <h2 className="text-gradient mb-12 text-2xl font-bold">About This Project</h2>
            </ScrollReveal>

            <div className="prose prose-invert prose-emerald max-w-none space-y-6">
              {project.content.split("\n").map((line, i) => {
                if (line.startsWith("## ")) {
                  return (
                    <h2 key={i} className="content-reveal mt-10 text-2xl font-bold text-white">
                      {line.replace("## ", "")}
                    </h2>
                  );
                }
                if (line.startsWith("### ")) {
                  return (
                    <h3 key={i} className="content-reveal mt-8 text-xl font-semibold text-white">
                      {line.replace("### ", "")}
                    </h3>
                  );
                }
                if (line.startsWith("- **")) {
                  const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
                  if (match) {
                    return (
                      <div key={i} className="content-reveal flex gap-3">
                        <span className="bg-emerald mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                        <div>
                          <strong className="text-white">{match[1]}:</strong>{" "}
                          <span className="text-muted-foreground">{match[2]}</span>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="content-reveal flex gap-3">
                      <span className="bg-emerald mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                      <p className="text-muted-foreground">{line.replace(/^- \*\*|\*\*$/g, "")}</p>
                    </div>
                  );
                }
                if (line.startsWith("- ")) {
                  return (
                    <div key={i} className="content-reveal flex gap-3">
                      <span className="bg-emerald mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                      <p className="text-muted-foreground">{line.replace("- ", "")}</p>
                    </div>
                  );
                }
                if (line.trim() === "") {
                  return <div key={i} className="h-2" />;
                }
                return (
                  <p key={i} className="content-reveal text-muted-foreground leading-relaxed">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
