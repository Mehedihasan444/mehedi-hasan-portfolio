"use client";

import { useEffect, useRef, memo } from "react";

interface GlitterWrapProps {
  className?: string;
  particleCount?: number;
  color1?: string;
  color2?: string;
  color3?: string;
}

function GlitterWrapCanvas({
  particleCount = 200,
  color1 = "#34d399",
  color2 = "#06b6d4",
  color3 = "#a78bfa",
  className,
}: GlitterWrapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const rect = canvas.parentElement!.getBoundingClientRect();
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(dpr, dpr);

    const cx = w / 2;
    const cy = h / 2;
    const colors = [color1, color2, color3];

    const stars = Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.max(w, h) * (0.15 + Math.random() * 0.55);
      return {
        angle,
        radius,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        r: 0.8 + Math.random() * 2,
        a: 0.4 + Math.random() * 0.6,
        speed: (0.1 + Math.random() * 0.3) * (Math.random() > 0.5 ? 1 : -1),
        drift: (Math.random() - 0.5) * 0.02,
        c: colors[Math.floor(Math.random() * 3)],
        seed: Math.random() * 1000,
      };
    });

    const loop = (t: number) => {
      if (document.hidden) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        s.angle += s.speed * 0.004;
        s.radius += s.drift;
        if (s.radius < 20) s.radius = Math.max(w, h) * 0.6;
        if (s.radius > Math.max(w, h) * 0.8) s.radius = 30;

        s.x = cx + Math.cos(s.angle) * s.radius;
        s.y = cy + Math.sin(s.angle) * s.radius;

        const twinkle = 0.5 + 0.5 * Math.sin(t * 0.0015 * s.seed + s.seed);
        const alpha = s.a * twinkle;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.c ?? "#34d399";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [particleCount, color1, color2, color3]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className ?? ""}`} aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}

export const GlitterWrapBackground = memo(GlitterWrapCanvas);
