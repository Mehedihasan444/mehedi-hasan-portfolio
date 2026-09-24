"use client";
import React, { useRef, useState, useCallback } from "react";

function merge(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export const TextHoverEffect = ({ text, className }: { text: string; className?: string }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState(false);
  const [cx, setCx] = useState("50%");
  const [cy, setCy] = useState("50%");

  const move = useCallback((e: React.MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setCx(`${((e.clientX - rect.left) / rect.width) * 100}%`);
    setCy(`${((e.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setCx("50%");
        setCy("50%");
      }}
      onMouseMove={move}
      className={merge("cursor-pointer select-none uppercase", className)}
      role="img"
      aria-label={text}
    >
      <title>{text}</title>
      <defs>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>

        <radialGradient id="revealMask" gradientUnits="userSpaceOnUse" r="25%" cx={cx} cy={cy}>
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>

        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>

        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base text — always visible with emerald stroke */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.4"
        className="stroke-emerald/30 fill-transparent font-[helvetica] text-7xl font-bold"
        pointerEvents="none"
      >
        {text}
      </text>

      {/* Gradient text — revealed by cursor spotlight */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.6"
        mask="url(#textMask)"
        className="fill-transparent font-[helvetica] text-7xl font-bold"
        style={{ filter: hovered ? "url(#glow)" : undefined }}
        pointerEvents="none"
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, rgba(5,150,105,0.12) 50%, rgba(6,182,212,0.08) 100%)",
      }}
    />
  );
};
