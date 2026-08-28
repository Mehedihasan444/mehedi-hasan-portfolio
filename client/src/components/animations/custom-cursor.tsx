"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const ringX = useSpring(mouseX, { stiffness: 200, damping: 30 });
  const ringY = useSpring(mouseY, { stiffness: 200, damping: 30 });

  const trailPositions = useRef<{ x: number; y: number }[]>([]);
  const rafId = useRef<number>(0);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      trailPositions.current.push({ x: e.clientX, y: e.clientY });
      if (trailPositions.current.length > 8) {
        trailPositions.current.shift();
      }
    },
    [mouseX, mouseY],
  );

  const onMouseDown = () => {
    cursorRef.current?.classList.add("scale-75");
    ringRef.current?.classList.add("scale-150", "opacity-30");
  };

  const onMouseUp = () => {
    cursorRef.current?.classList.remove("scale-75");
    ringRef.current?.classList.remove("scale-150", "opacity-30");
  };

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMoveThrottled = (e: MouseEvent) => {
      // throttle via rAF – push at most once per frame
      if (rafId.current === 0) onMouseMove(e);
    };
    window.addEventListener("mousemove", onMoveThrottled, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    const interactiveElements = document.querySelectorAll(
      "a, button, input, textarea, [data-cursor='pointer']",
    );

    const onEnter = () => {
      ringRef.current?.classList.add("scale-150", "border-emerald/50", "bg-emerald/5");
      cursorRef.current?.classList.add("mix-blend-difference");
    };
    const onLeave = () => {
      ringRef.current?.classList.remove("scale-150", "border-emerald/50", "bg-emerald/5");
      cursorRef.current?.classList.remove("mix-blend-difference");
    };

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMoveThrottled);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      cancelAnimationFrame(rafId.current);
    };
  }, [onMouseMove]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let running = true;
    const renderTrails = () => {
      if (!running || document.hidden) {
        rafId.current = requestAnimationFrame(renderTrails);
        return;
      }
      if (trailsRef.current) {
        const dots = trailsRef.current.querySelectorAll<HTMLSpanElement>("span");
        trailPositions.current.forEach((pos, i) => {
          if (dots[i]) {
            dots[i].style.transform = `translate(${pos.x}px, ${pos.y}px)`;
            dots[i].style.opacity = `${0.15 - i * 0.018}`;
          }
        });
      }
      rafId.current = requestAnimationFrame(renderTrails);
    };

    rafId.current = requestAnimationFrame(renderTrails);
    return () => {
      running = false;
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (typeof window !== "undefined") {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
    if (window.matchMedia("(pointer: coarse)").matches) return null;
  }

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[999] h-2 w-2 rounded-full bg-white mix-blend-difference"
        style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[999] flex h-8 w-8 items-center justify-center rounded-full border border-white/30 transition-[width,height] duration-300"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
      />
      <div ref={trailsRef} className="pointer-events-none fixed left-0 top-0 z-[998]" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="bg-emerald/20 absolute block h-1 w-1 rounded-full"
            style={{ transition: "opacity 0.1s" }}
          />
        ))}
      </div>
    </>
  );
}
