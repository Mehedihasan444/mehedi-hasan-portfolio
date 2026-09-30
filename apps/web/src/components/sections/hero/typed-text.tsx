"use client";

import { useEffect, useState } from "react";

export interface TypedTextProps {
  text: string;
  delay: number;
}

export function TypedText({ text, delay }: TypedTextProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      // Reduced-motion: show the full text immediately, no timers.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mount/external-system sync
      setDisplayed(text);
      return;
    }

    let interval: ReturnType<typeof setInterval> | undefined;
    const timer = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        if (i <= text.length) {
          setDisplayed(text.slice(0, i));
          i++;
        } else if (interval) {
          clearInterval(interval);
        }
      }, 30);
    }, delay * 1000);
    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [text, delay]);

  return (
    <span className="text-white/80">
      {displayed}
      {displayed.length < text.length && (
        <span className="bg-emerald animate-cursor-blink ml-0.5 inline-block h-3 w-0.5" />
      )}
    </span>
  );
}
