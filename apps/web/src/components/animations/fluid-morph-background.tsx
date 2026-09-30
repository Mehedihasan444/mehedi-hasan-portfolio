"use client";

import { useRef, useEffect } from "react";

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetRadius: number;
  hue: number;
  saturation: number;
  lightness: number;
}

interface FluidMorphBackgroundProps {
  className?: string;
  blobCount?: number;
  baseHue?: number;
}

const MAX_BLOBS = 12;

export function FluidMorphBackground({
  className = "",
  blobCount = 5,
  baseHue = 160,
}: FluidMorphBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const frameRef = useRef<number>(0);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const count = Math.min(Math.max(Math.floor(blobCount), 0), MAX_BLOBS);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const makeBlobs = () =>
      Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 100 + Math.random() * 200,
        targetRadius: 100 + Math.random() * 200,
        hue: baseHue + (Math.random() - 0.5) * 40,
        saturation: 50 + Math.random() * 30,
        lightness: 40 + Math.random() * 20,
      }));

    blobsRef.current = makeBlobs();

    const paintBlob = (blob: Blob) => {
      const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
      gradient.addColorStop(
        0,
        `oklch(${blob.lightness / 100} ${blob.saturation / 100} ${blob.hue} / 0.15)`,
      );
      gradient.addColorStop(
        0.5,
        `oklch(${blob.lightness / 100} ${blob.saturation / 100} ${blob.hue + 15} / 0.08)`,
      );
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(blob.x - blob.radius, blob.y - blob.radius, blob.radius * 2, blob.radius * 2);
    };

    const paintStaticFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const blob of blobsRef.current) paintBlob(blob);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      paintStaticFrame();
      return () => {
        window.removeEventListener("resize", resize);
      };
    }

    const scheduleResume = () => {
      if (resumeTimeoutRef.current) return;
      resumeTimeoutRef.current = setTimeout(() => {
        resumeTimeoutRef.current = null;
        if (!document.hidden) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          scheduleResume();
        }
      }, 500);
    };

    const animate = () => {
      frameRef.current = 0;
      if (document.hidden) {
        scheduleResume();
        return;
      }
      timeRef.current += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const blobs = blobsRef.current;

      for (const blob of blobs) {
        blob.x += blob.vx + Math.sin(timeRef.current + blob.radius) * 0.3;
        blob.y += blob.vy + Math.cos(timeRef.current + blob.radius) * 0.3;
        blob.targetRadius =
          100 +
          Math.sin(timeRef.current * 0.5 + blob.hue) * 80 +
          Math.cos(timeRef.current * 0.3 + blob.x) * 40;
        blob.radius += (blob.targetRadius - blob.radius) * 0.02;

        if (blob.x < -blob.radius) blob.x = canvas.width + blob.radius;
        if (blob.x > canvas.width + blob.radius) blob.x = -blob.radius;
        if (blob.y < -blob.radius) blob.y = canvas.height + blob.radius;
        if (blob.y > canvas.height + blob.radius) blob.y = -blob.radius;

        paintBlob(blob);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
      window.removeEventListener("resize", resize);
    };
  }, [blobCount, baseHue]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 ${className}`}
      aria-hidden
    />
  );
}
