"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export function Lightbox({
  images,
  index,
  onClose,
}: {
  images: string[];
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync controlled index prop
    setCurrent(index);
  }, [index]);

  useEffect(() => {
    closeRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrent((i) => (i > 0 ? i - 1 : i));
      if (e.key === "ArrowRight") setCurrent((i) => (i < images.length - 1 ? i + 1 : i));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [images.length, onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const src = images[current];
  if (!src) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Image gallery, image ${current + 1} of ${images.length}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl text-white/70 transition-colors hover:bg-white/20 hover:text-white"
      >
        <span aria-hidden="true">✕</span>
      </button>

      {images.length > 1 && current > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrent((i) => i - 1);
          }}
          aria-label="Previous image"
          className="absolute left-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-all hover:bg-white/20"
        >
          <span aria-hidden="true">‹</span>
        </button>
      )}

      {images.length > 1 && current < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrent((i) => i + 1);
          }}
          aria-label="Next image"
          className="absolute right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-all hover:bg-white/20"
        >
          <span aria-hidden="true">›</span>
        </button>
      )}

      <div
        className="flex h-full w-full items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex flex-col items-center">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src={src}
              alt={`Gallery image ${current + 1} of ${images.length}`}
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, 1200px"
              className="max-h-[80vh] w-auto object-contain"
            />
          </div>
          {images.length > 1 && (
            <p className="mt-4 text-sm text-white/50" role="status">
              {current + 1} / {images.length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
