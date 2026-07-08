"use client";

import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "violet-cyan" | "gold" | "cyan" | "custom";
  animate?: boolean;
  from?: string;
  via?: string;
  to?: string;
}

export function GradientText({
  children,
  className,
  variant = "violet-cyan",
  animate = false,
  from,
  via,
  to,
}: GradientTextProps) {
  const gradientMap = {
    "violet-cyan": "from-violet-soft via-violet to-cyan",
    gold: "from-amber-300 via-amber-500 to-orange-500",
    cyan: "from-cyan-soft via-cyan to-indigo",
    custom: "",
  };

  const customStyle =
    variant === "custom" && from
      ? {
          background: `linear-gradient(135deg, ${from}, ${via ?? ""}, ${to ?? from})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }
      : undefined;

  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent",
        variant !== "custom" && `bg-gradient-to-r ${gradientMap[variant]}`,
        animate && "animate-gradient-shift bg-[length:200%_auto]",
        className,
      )}
      style={customStyle}
    >
      {children}
    </span>
  );
}
