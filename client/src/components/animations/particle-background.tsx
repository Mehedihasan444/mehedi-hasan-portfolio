"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const rafId = useRef<number>(0);

  const prefersReduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const spawnParticle = useCallback((x: number, y: number) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.3 + Math.random() * 0.5;
    const maxLife = 60 + Math.random() * 60;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 1 + Math.random() * 2,
      alpha: 0.5 + Math.random() * 0.5,
      life: 0,
      maxLife,
    };
  }, []);

  useEffect(() => {
    if (prefersReduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const MAX_PARTICLES = 120;
    let lastMouseSpawn = 0;

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    onResize();
    window.addEventListener("resize", onResize);

    const onMouse = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseSpawn < 32) return; // ~30fps cap
      lastMouseSpawn = now;
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (particlesRef.current.length >= MAX_PARTICLES) return;
      for (let i = 0; i < 1; i++) {
        particlesRef.current.push(
          spawnParticle(
            e.clientX + (Math.random() - 0.5) * 20,
            e.clientY + (Math.random() - 0.5) * 20,
          ),
        );
      }
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const ambientInterval = setInterval(() => {
      if (document.hidden) return;
      if (particlesRef.current.length >= MAX_PARTICLES) return;
      for (let i = 0; i < 2; i++) {
        if (particlesRef.current.length < MAX_PARTICLES)
          particlesRef.current.push(
            spawnParticle(Math.random() * canvas.width, canvas.height + 10),
          );
      }
    }, 700);

    const animate = () => {
      if (document.hidden) {
        rafId.current = requestAnimationFrame(animate);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.vy -= 0.01;
        p.alpha = Math.max(0, (1 - p.life / p.maxLife) * 0.6);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150, 160, 255, ${p.alpha})`;
        ctx.fill();
      }

      rafId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      clearInterval(ambientInterval);
      cancelAnimationFrame(rafId.current);
    };
  }, [prefersReduced, spawnParticle]);

  if (prefersReduced) return null;

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden />;
}
