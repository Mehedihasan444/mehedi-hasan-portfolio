"use client";

import { useState, useEffect, useRef } from "react";

interface MousePosition {
  x: number;
  y: number;
  normalX: number;
  normalY: number;
}

export function useMousePosition(enabled = true): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalX: 0.5,
    normalY: 0.5,
  });
  const raf = useRef(0);
  const pending = useRef<MouseEvent | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia?.("(pointer: coarse)").matches) return;

    const flush = () => {
      const e = pending.current;
      pending.current = null;
      raf.current = 0;
      if (!e) return;
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      setPosition({
        x: e.clientX,
        y: e.clientY,
        normalX: w > 0 ? e.clientX / w : 0.5,
        normalY: h > 0 ? e.clientY / h : 0.5,
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      pending.current = e;
      if (!raf.current) raf.current = requestAnimationFrame(flush);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  return position;
}
