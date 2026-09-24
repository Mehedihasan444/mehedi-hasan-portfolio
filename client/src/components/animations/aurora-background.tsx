"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  className?: string;
  colors?: string[];
  blur?: number;
  opacity?: number;
}

const DEFAULT_AURORA_COLORS = [
  "rgba(5, 150, 105, 0.35)",
  "rgba(6, 182, 212, 0.25)",
  "rgba(4, 120, 87, 0.3)",
  "rgba(52, 211, 153, 0.2)",
  "rgba(6, 182, 212, 0.15)",
];

export function AuroraBackground({
  className,
  colors = DEFAULT_AURORA_COLORS,
  blur = 80,
  opacity = 0.7,
}: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeRef = useRef(0);
  const colorsRef = useRef(colors);

  useEffect(() => {
    colorsRef.current = colors;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const palette = colorsRef.current;

    const paintStaticFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      palette.forEach((color, i) => {
        const x = canvas.width * ((i + 1) / (palette.length + 1));
        const y = canvas.height / 2;
        const r = 250;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, color);
        grad.addColorStop(1, "transparent");
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        paintStaticFrame();
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      paintStaticFrame();
      return () => {
        ro.disconnect();
      };
    }

    const orbs = palette.map((color, i) => ({
      color,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 300 + 200,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      phase: (i / Math.max(palette.length, 1)) * Math.PI * 2,
    }));

    const scheduleResume = () => {
      if (resumeTimeoutRef.current) return;
      resumeTimeoutRef.current = setTimeout(() => {
        resumeTimeoutRef.current = null;
        if (!document.hidden) {
          animRef.current = requestAnimationFrame(draw);
        } else {
          scheduleResume();
        }
      }, 500);
    };

    const draw = () => {
      animRef.current = 0;
      if (document.hidden) {
        scheduleResume();
        return;
      }
      timeRef.current += 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      orbs.forEach((orb) => {
        orb.x += orb.vx + Math.sin(timeRef.current + orb.phase) * 0.5;
        orb.y += orb.vy + Math.cos(timeRef.current + orb.phase * 1.3) * 0.4;

        if (orb.x < -orb.r) orb.x = canvas.width + orb.r;
        if (orb.x > canvas.width + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = canvas.height + orb.r;
        if (orb.y > canvas.height + orb.r) orb.y = -orb.r;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, "transparent");

        ctx.save();
        ctx.filter = `blur(${blur * 0.5}px)`;
        ctx.globalAlpha = opacity;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = 0;
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
      ro.disconnect();
    };
  }, [blur, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      aria-hidden
    />
  );
}
