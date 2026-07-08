"use client";

import { useState, useEffect, useCallback } from "react";

interface MousePosition {
  x: number;
  y: number;
  normalX: number;
  normalY: number;
}

export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalX: 0.5,
    normalY: 0.5,
  });

  const onMouseMove = useCallback((e: MouseEvent) => {
    setPosition({
      x: e.clientX,
      y: e.clientY,
      normalX: e.clientX / window.innerWidth,
      normalY: e.clientY / window.innerHeight,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  return position;
}
