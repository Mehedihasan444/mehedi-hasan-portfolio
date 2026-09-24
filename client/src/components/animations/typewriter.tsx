"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface TypewriterProps {
  words: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseMs?: number;
  className?: string;
  cursorClassName?: string;
  loop?: boolean;
}

export function Typewriter({
  words,
  speed = 65,
  deleteSpeed = 35,
  pauseMs = 1800,
  className,
  cursorClassName,
  loop = true,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [announced, setAnnounced] = useState(words[0] ?? "");
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [retryKey, setRetryKey] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount/external-system sync
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Reduced motion: show final state immediately, no timers.
  useEffect(() => {
    if (!reducedMotion) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount/external-system sync
    setDisplayed(words[0] ?? "");
    setAnnounced(words[0] ?? "");
    setPhase("pausing");
  }, [reducedMotion, words]);

  useEffect(() => {
    if (reducedMotion) return;
    if (words.length === 0) return;

    const word = words[wordIdx] ?? "";

    // Pause while tab hidden: retry shortly instead of advancing.
    if (document.hidden) {
      timeoutRef.current = setTimeout(() => setRetryKey((k) => k + 1), 500);
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      };
    }

    if (phase === "typing") {
      if (charIdx < word.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(word.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        }, speed);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- mount/external-system sync
        setAnnounced(word);
        setPhase("pausing");
      }
    } else if (phase === "pausing") {
      timeoutRef.current = setTimeout(() => {
        // Single-shot: after one full cycle with loop=false, stay on last word.
        if (!loop && wordIdx >= words.length - 1) return;
        setPhase("deleting");
      }, pauseMs);
    } else if (charIdx > 0) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(word.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      }, deleteSpeed);
    } else {
      if (loop || wordIdx < words.length - 1) {
        setWordIdx((w) => (w + 1) % Math.max(words.length, 1));
        setPhase("typing");
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    };
  }, [charIdx, phase, wordIdx, words, speed, deleteSpeed, pauseMs, loop, reducedMotion, retryKey]);

  return (
    <span className={cn("inline-block", className)} aria-live="off">
      <span aria-hidden="true">
        {displayed}
        <span
          className={cn(
            "animate-cursor-blink ml-0.5 inline-block h-[1em] w-0.5 bg-current align-middle",
            cursorClassName,
          )}
          aria-hidden="true"
        />
      </span>
      <span className="sr-only" aria-live="polite">
        {announced}
      </span>
    </span>
  );
}
