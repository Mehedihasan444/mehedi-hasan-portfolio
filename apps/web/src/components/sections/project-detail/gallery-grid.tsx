"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Lightbox } from "./lightbox";

export function GalleryGrid({ images, title }: { images: string[]; title?: string }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [broken, setBroken] = useState<Record<string, boolean>>({});
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!images.length) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const items = gridRef.current?.querySelectorAll(".gallery-item");
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 24, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.07,
            duration: 0.55,
            ease: "power3.out",
            overwrite: true,
            clearProps: "transform",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
          },
        );
      }
    }, gridRef);

    return () => ctx.revert();
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="mx-auto mt-14 max-w-6xl px-6">
      <ScrollReveal>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
              Screenshots
            </p>
            <h2 className="text-gradient mt-1 text-2xl font-bold sm:text-3xl">Gallery</h2>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
            {images.length} {images.length === 1 ? "image" : "images"} · click to expand
          </span>
        </div>
      </ScrollReveal>

      <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((src, i) => {
          const isBroken = broken[`${src}-${i}`];
          return (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => {
                if (isBroken) return;
                setLightboxIndex(i);
                setLightboxOpen(true);
              }}
              aria-label={`Open gallery image ${i + 1} of ${images.length}${title ? ` for ${title}` : ""}`}
              className="gallery-item group relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left transition-colors hover:border-white/25"
            >
              {!isBroken ? (
                <Image
                  src={src}
                  alt={`${title ? `${title} s` : "S"}creenshot ${i + 1} of ${images.length}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  onError={() => setBroken((b) => ({ ...b, [`${src}-${i}`]: true }))}
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent text-sm text-white/35">
                  Image unavailable
                </span>
              )}
              {!isBroken && (
                <>
                  <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white/85 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    {String(i + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <svg
                      aria-hidden="true"
                      className="h-8 w-8 text-white drop-shadow-lg"
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
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {lightboxOpen && (
        <Lightbox images={images} index={lightboxIndex} onClose={() => setLightboxOpen(false)} />
      )}
    </div>
  );
}
