"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const ringX = useSpring(mouseX, { stiffness: 200, damping: 30 });
  const ringY = useSpring(mouseY, { stiffness: 200, damping: 30 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- feature-detect then enable
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    let pending: MouseEvent | null = null;

    const flush = () => {
      raf = 0;
      if (pending) {
        mouseX.set(pending.clientX);
        mouseY.set(pending.clientY);
        pending = null;
      }
    };

    const onMove = (e: MouseEvent) => {
      pending = e;
      if (!raf) raf = requestAnimationFrame(flush);
    };
    const onDown = () => {
      cursorRef.current?.classList.add("scale-75");
      ringRef.current?.classList.add("scale-150", "opacity-30");
    };
    const onUp = () => {
      cursorRef.current?.classList.remove("scale-75");
      ringRef.current?.classList.remove("scale-150", "opacity-30");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    const onEnter = () => {
      ringRef.current?.classList.add("scale-150", "border-emerald-500/50", "bg-emerald-500/5");
      cursorRef.current?.classList.add("mix-blend-difference");
    };
    const onLeave = () => {
      ringRef.current?.classList.remove("scale-150", "border-emerald-500/50", "bg-emerald-500/5");
      cursorRef.current?.classList.remove("mix-blend-difference");
    };

    const observer = new MutationObserver(() => {
      document
        .querySelectorAll("a, button, input, textarea, select, [data-cursor='pointer']")
        .forEach((el) => {
          if ((el as HTMLElement).dataset.cursorBound) return;
          (el as HTMLElement).dataset.cursorBound = "true";
          el.addEventListener("mouseenter", onEnter);
          el.addEventListener("mouseleave", onLeave);
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.querySelectorAll("a, button, input, textarea, select").forEach((el) => {
      (el as HTMLElement).dataset.cursorBound = "true";
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [enabled, mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[999] h-2 w-2 rounded-full bg-white mix-blend-difference"
        style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[999] flex h-8 w-8 items-center justify-center rounded-full border border-white/30 transition-[width,height] duration-300"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
      />
    </>
  );
}
