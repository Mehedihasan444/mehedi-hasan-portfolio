"use client";

import { useEffect, useSyncExternalStore } from "react";

interface ScrollProgress {
  progress: number;
  scrollY: number;
  direction: "up" | "down";
}

// Singleton store: hero-scene instantiated 4× useScrollProgress -> 4 identical listeners
let sharedState: ScrollProgress = { progress: 0, scrollY: 0, direction: "down" };
let prevY = 0;
let rafId = 0;
const listeners = new Set<() => void>();
let initialized = false;

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot(): ScrollProgress {
  return sharedState;
}
function getServerSnapshot(): ScrollProgress {
  return sharedState;
}
function emit() {
  listeners.forEach((cb) => cb());
}
function onScroll() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    if (typeof window === "undefined") return;
    const scrollY = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? scrollY / max : 0;
    sharedState = {
      progress: Math.min(1, Math.max(0, progress)),
      scrollY,
      direction: scrollY > prevY ? "down" : "up",
    };
    prevY = scrollY;
    emit();
  });
}
function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

export function useScrollProgress(): ScrollProgress {
  const live = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    ensureInit();
  }, []);
  return live;
}
