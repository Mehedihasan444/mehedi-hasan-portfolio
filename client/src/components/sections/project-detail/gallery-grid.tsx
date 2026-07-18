"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Lightbox } from "./lightbox";

export function GalleryGrid({ images }: { images: string[] }) {
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
            <Image
              src={src}
              alt={`Screenshot ${i + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
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
