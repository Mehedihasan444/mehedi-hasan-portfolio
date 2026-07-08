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
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null!);

  useEffect(() => {
    const currentWord = words[wordIdx] ?? "";

    const next = () => {
      if (phase === "typing") {
        if (charIdx < currentWord.length) {
          setDisplayed(currentWord.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
          timeoutRef.current = setTimeout(next, speed);
        } else {
          setPhase("pausing");
          timeoutRef.current = setTimeout(() => setPhase("deleting"), pauseMs);
        }
      } else if (phase === "deleting") {
        if (charIdx > 0) {
          setDisplayed(currentWord.slice(0, charIdx - 1));
          setCharIdx((c) => c - 1);
          timeoutRef.current = setTimeout(next, deleteSpeed);
        } else {
          if (loop || wordIdx < words.length - 1) {
            setWordIdx((w) => (w + 1) % words.length);
            setPhase("typing");
          }
        }
      }
    };

    timeoutRef.current = setTimeout(next, phase === "typing" ? speed : deleteSpeed);

    return () => clearTimeout(timeoutRef.current);
  }, [charIdx, phase, wordIdx, words, speed, deleteSpeed, pauseMs, loop]);

  return (
    <span className={cn("inline-block", className)}>
      {displayed}
      <span
        className={cn(
          "animate-cursor-blink ml-0.5 inline-block h-[1em] w-0.5 bg-current align-middle",
          cursorClassName,
        )}
        aria-hidden
      />
    </span>
  );
}
