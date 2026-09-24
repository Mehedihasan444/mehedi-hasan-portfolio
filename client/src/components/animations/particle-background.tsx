"use client";

import { useEffect, useRef, useCallback, useState } from "react";

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

const MAX_PARTICLES = 120;
const MOUSE_THROTTLE_MS = 32;

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const rafId = useRef<number>(0);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingMouseRef = useRef<{ x: number; y: number } | null>(null);
  const mouseRafRef = useRef<number>(0);
  const lastMouseSpawnRef = useRef(0);

  const [disabled, setDisabled] = useState(
    () =>
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.matchMedia("(pointer: coarse)").matches),
  );

  const spawnParticle = useCallback((x: number, y: number): Particle => {
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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount/external-system sync
    setDisabled(reduced || coarse);
    if (reduced || coarse) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    onResize();
    window.addEventListener("resize", onResize);

    const flushMouse = () => {
      mouseRafRef.current = 0;
      const pending = pendingMouseRef.current;
      pendingMouseRef.current = null;
      if (!pending) return;
      const now = performance.now();
      if (now - lastMouseSpawnRef.current < MOUSE_THROTTLE_MS) return;
      lastMouseSpawnRef.current = now;
      mouseRef.current = pending;
      if (particlesRef.current.length >= MAX_PARTICLES) return;
      particlesRef.current.push(
        spawnParticle(
          pending.x + (Math.random() - 0.5) * 20,
          pending.y + (Math.random() - 0.5) * 20,
        ),
      );
      if (particlesRef.current.length > MAX_PARTICLES) {
        particlesRef.current.splice(0, particlesRef.current.length - MAX_PARTICLES);
      }
    };

    const onMouse = (e: MouseEvent) => {
      pendingMouseRef.current = { x: e.clientX, y: e.clientY };
      if (!mouseRafRef.current) {
        mouseRafRef.current = requestAnimationFrame(flushMouse);
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

    const scheduleResume = () => {
      if (resumeTimeoutRef.current) return;
      resumeTimeoutRef.current = setTimeout(() => {
        resumeTimeoutRef.current = null;
        if (!document.hidden) {
          rafId.current = requestAnimationFrame(animate);
        } else {
          scheduleResume();
        }
      }, 500);
    };

    const handleVisibility = () => {
      if (!document.hidden && !rafId.current) {
        rafId.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const animate = () => {
      rafId.current = 0;
      if (document.hidden) {
        scheduleResume();
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

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(ambientInterval);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
      if (mouseRafRef.current) cancelAnimationFrame(mouseRafRef.current);
      mouseRafRef.current = 0;
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = 0;
    };
  }, [spawnParticle]);

  if (disabled) return null;

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden />;
}
