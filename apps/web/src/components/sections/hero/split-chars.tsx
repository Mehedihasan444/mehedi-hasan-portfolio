"use client";

interface SplitCharsProps {
  text: string;
  className?: string;
}

/**
 * Renders each character as a plain span for the scroll-out animation.
 * Requires the parent heading to carry an `aria-label` with the full text,
 * since every char here is `aria-hidden="true"`.
 */
export function SplitChars({ text, className }: SplitCharsProps) {
  return (
    <>
      {text.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          className={`scroll-char ${className ?? ""}`}
          aria-hidden="true"
          style={{
            display: "inline-block",
            whiteSpace: char === " " ? "pre" : "normal",
            backfaceVisibility: "hidden",
          }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </>
  );
}
