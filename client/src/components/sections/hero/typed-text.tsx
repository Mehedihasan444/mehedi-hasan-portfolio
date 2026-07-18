"use client";

import { useEffect, useState } from "react";

export function TypedText({ text, delay }: { text: string; delay: number }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i <= text.length) {
          setDisplayed(text.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
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
