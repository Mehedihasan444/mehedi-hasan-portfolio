"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface GlobeScrollState {
  progress: number;
  rotationSpeed: number;
  cameraDistance: number;
  cameraTilt: number;
  parallaxX: number;
  parallaxY: number;
  isNearTop: boolean;
}

export function useGlobeScroll() {
  const [state, setState] = useState<GlobeScrollState>({
    progress: 0,
    rotationSpeed: 1,
    cameraDistance: 0,
    cameraTilt: 0,
    parallaxX: 0,
    parallaxY: 0,
    isNearTop: true,
  });

  const rafId = useRef(0);
  const prevScrollY = useRef(0);

  const update = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const sy = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const rawProgress = max > 0 ? sy / max : 0;
      const progress = Math.min(1, Math.max(0, rawProgress));

      const isNearTop = sy < window.innerHeight * 0.6;
      const localProgress = Math.min(1, sy / window.innerHeight);

      const rotationSpeed = 1 - localProgress * 0.7;
      const cameraDistance = localProgress * 1.5;
      const cameraTilt = localProgress * 0.3;
      const parallaxY = progress * 0.15;

      const direction = sy > prevScrollY.current ? 1 : -1;
      const parallaxX = direction * 0.02;

      prevScrollY.current = sy;

      setState({
        progress,
        rotationSpeed,
        cameraDistance,
        cameraTilt,
        parallaxX,
        parallaxY,
        isNearTop,
      });
    });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(rafId.current);
    };
  }, [update]);

  return state;
}
