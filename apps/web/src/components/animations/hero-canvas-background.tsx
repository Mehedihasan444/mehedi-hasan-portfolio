"use client";

import { useRef, useEffect } from "react";

interface Orb {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  targetRadius: number;
  hue: number;
  saturation: number;
  lightness: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface GridLine {
  type: "h" | "v";
  pos: number;
  offset: number;
  speed: number;
}

export function HeroCanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<Orb[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const gridRef = useRef<GridLine[]>([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const scrollRef = useRef(0);
  const frameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0,
      h = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / w, y: e.clientY / h };
    };
    window.addEventListener("mousemove", onMouse);

    const onScroll = () => {
      scrollRef.current = window.scrollY / (window.innerHeight * 2);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    orbsRef.current = Array.from({ length: 6 }, () => {
      const cx = 0.3 + Math.random() * 0.4;
      const cy = 0.3 + Math.random() * 0.4;
      return {
        x: cx * w,
        y: cy * h,
        baseX: cx * w,
        baseY: cy * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 150 + Math.random() * 250,
        targetRadius: 150 + Math.random() * 250,
        hue: 160 + (Math.random() - 0.5) * 30,
        saturation: 50 + Math.random() * 30,
        lightness: 35 + Math.random() * 20,
      };
    });

    gridRef.current = Array.from({ length: 20 }, (_, i) => ({
      type: (i % 2 === 0 ? "h" : "v") as "h" | "v",
      pos: (i / 20) * (i % 2 === 0 ? h : w),
      offset: 0,
      speed: 0.5 + Math.random() * 0.5,
    }));

    const animate = () => {
      if (document.hidden) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }
      timeRef.current += 0.008;
      const scroll = scrollRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, w, h);

      const gradient = ctx.createRadialGradient(
        w * (0.5 + (mx - 0.5) * 0.1),
        h * (0.5 + (my - 0.5) * 0.1),
        0,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.8,
      );
      gradient.addColorStop(0, `oklch(0.08 0.01 160 / ${0.4 + scroll * 0.2})`);
      gradient.addColorStop(0.5, `oklch(0.04 0.008 170 / ${0.5 + scroll * 0.1})`);
      gradient.addColorStop(1, "oklch(0.02 0.003 150 / 1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      const orbs = orbsRef.current;
      for (const orb of orbs) {
        const scrollOffset = scroll * 0.4;
        const mouseOffsetX = (mx - 0.5) * 60;
        const mouseOffsetY = (my - 0.5) * 60;

        orb.x += orb.vx + Math.sin(timeRef.current + orb.radius) * 0.2;
        orb.y += orb.vy + Math.cos(timeRef.current + orb.radius) * 0.2;
        orb.x += (orb.baseX + mouseOffsetX - orb.x + scrollOffset * 100) * 0.005;
        orb.y += (orb.baseY + mouseOffsetY - orb.y - scrollOffset * 80) * 0.005;

        orb.targetRadius = Math.max(
          80,
          150 +
            Math.sin(timeRef.current * 0.4 + orb.hue) * 100 +
            Math.cos(timeRef.current * 0.2 + orb.baseX) * 60 +
            scroll * 80,
        );
        orb.radius += (orb.targetRadius - orb.radius) * 0.015;

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);

        const alpha = 0.08 + scroll * 0.06 + Math.sin(timeRef.current * 0.3 + orb.hue) * 0.02;

        gradient.addColorStop(
          0,
          `oklch(${orb.lightness / 100} ${orb.saturation / 100} ${orb.hue} / ${alpha})`,
        );
        gradient.addColorStop(
          0.5,
          `oklch(${orb.lightness / 100} ${orb.saturation / 100} ${orb.hue + 10} / ${alpha * 0.5})`,
        );
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      const grid = gridRef.current;
      ctx.strokeStyle = `oklch(1 0 0 / ${0.015 + scroll * 0.015})`;
      ctx.lineWidth = 0.5;

      for (const line of grid) {
        line.offset += line.speed * 0.3 + scroll * 0.5;

        ctx.beginPath();
        if (line.type === "h") {
          const y = line.pos + Math.sin(timeRef.current * 0.3 + line.offset) * 8 + scroll * 20;
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
        } else {
          const x = line.pos + Math.sin(timeRef.current * 0.3 + line.offset) * 8 + scroll * 20;
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
        }
        ctx.stroke();
      }

      const particleCount = Math.floor(30 + scroll * 15);
      if (particlesRef.current.length < particleCount) {
        const needed = particleCount - particlesRef.current.length;
        for (let i = 0; i < needed; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.1 + Math.random() * 0.2;
          particlesRef.current.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            maxLife: 200 + Math.random() * 300,
            size: 0.5 + Math.random() * 1.5,
          });
        }
      }

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (!p) continue;
        p.x += p.vx + (mx - 0.5) * 0.1;
        p.y += p.vy + (my - 0.5) * 0.1 - scroll * 0.2;
        p.life -= 1 / p.maxLife;

        if (p.life <= 0 || p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.6 0.12 170 / ${p.life * 0.4})`;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />;
}
