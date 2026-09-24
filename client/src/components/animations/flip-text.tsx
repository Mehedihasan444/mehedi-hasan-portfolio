"use client";

import { useState, useEffect, useCallback } from "react";

interface FlipTextProps {
  words: string[];
  className?: string;
  interval?: number;
  duration?: number;
}

export function FlipText({
  words,
  className = "",
  interval = 3000,
  duration = 0.6,
}: FlipTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const next = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
      setIsAnimating(false);
    }, duration * 1000);
  }, [isAnimating, duration, words.length]);

  useEffect(() => {
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval]);

  const currentWord = words[currentIndex] ?? "";
  const nextWord = words[(currentIndex + 1) % Math.max(words.length, 1)] ?? "";

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="sr-only">{currentWord}</span>
      {currentWord.split("").map((char, i) => (
        <span
          key={`${currentIndex}-${i}`}
          className="inline-block"
          style={{
            animationName: isAnimating ? "flipOut" : "none",
            animationDuration: `${duration}s`,
            animationTimingFunction: "ease-in-out",
            animationFillMode: "forwards",
            animationDelay: `${i * 0.04}s`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
      <span
        className="absolute inset-0"
        style={{ opacity: isAnimating ? 1 : 0, pointerEvents: isAnimating ? "auto" : "none" }}
      >
        {nextWord.split("").map((char, i) => (
          <span
            key={`next-${i}`}
            className="inline-block"
            style={{
              animationName: isAnimating ? "flipIn" : "none",
              animationDuration: `${duration}s`,
              animationTimingFunction: "ease-in-out",
              animationFillMode: "forwards",
              animationDelay: `${i * 0.04}s`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </span>
  );
}
