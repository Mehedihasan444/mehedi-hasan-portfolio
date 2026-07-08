"use client";

import { useRef, useEffect } from "react";

interface TrailPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

interface PixelatedImageTrailProps {
  imageSrc?: string;
  pixelSize?: number;
  trailLength?: number;
  className?: string;
}

export function PixelatedImageTrail({
  imageSrc = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=32&q=80&fit=crop",
  pixelSize = 8,
  trailLength = 15,
  className = "",
}: PixelatedImageTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailsRef = useRef<TrailPoint[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const imgRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    imgRef.current = img;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouse);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x, y } = mouseRef.current;

      trailsRef.current.push({
        x,
        y,
        vx: 0,
        vy: 0,
        life: 1,
      });

      if (trailsRef.current.length > trailLength) {
        trailsRef.current = trailsRef.current.slice(-trailLength);
      }

      trailsRef.current.forEach((point, i) => {
        point.life -= 0.02;
        const alpha = Math.max(0, point.life);

        if (img.complete && img.naturalWidth > 0) {
          const size = pixelSize * (0.5 + alpha * 0.5);
          const offset = i * 2;

          for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -2; dy <= 2; dy++) {
              const sx = (point.x + dx * size + offset * 0.5) % img.naturalWidth;
              const sy = (point.y + dy * size + offset * 0.5) % img.naturalHeight;

              ctx.globalAlpha = alpha * 0.3;
              ctx.drawImage(
                img,
                Math.abs(sx),
                Math.abs(sy),
                1,
                1,
                point.x + dx * size - size / 2,
                point.y + dy * size - size / 2,
                size,
                size,
              );
              ctx.globalAlpha = 1;
            }
          }
        }
      });

      trailsRef.current = trailsRef.current.filter((p) => p.life > 0);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [imageSrc, pixelSize, trailLength]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-[100] ${className}`}
      style={{ mixBlendMode: "screen" }}
    />
  );
}
