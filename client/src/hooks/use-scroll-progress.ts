"use client";

import { useEffect, useSyncExternalStore } from "react";

interface ScrollProgress {
  progress: number;
  scrollY: number;
  direction: "up" | "down";
}

const INITIAL: ScrollProgress = { progress: 0, scrollY: 0, direction: "down" };
const SERVER_SNAPSHOT: ScrollProgress = { progress: 0, scrollY: 0, direction: "down" };

let sharedState: ScrollProgress = INITIAL;
let prevY = 0;
let rafId = 0;
const listeners = new Set<() => void>();
let initialized = false;

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
function getSnapshot(): ScrollProgress {
  return sharedState;
}
function getServerSnapshot(): ScrollProgress {
  return SERVER_SNAPSHOT;
}
function emit() {
  listeners.forEach((cb) => cb());
}
function onScroll() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (document.hidden) return;
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
  window.addEventListener("resize", onScroll, { passive: true });
}

export function useScrollProgress(): ScrollProgress {
  const live = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    ensureInit();
  }, []);
  return live;
}
