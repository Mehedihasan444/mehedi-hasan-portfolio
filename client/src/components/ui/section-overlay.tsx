import { cn } from "@/lib/utils";

type SectionOverlayProps = {
  variant?: "default" | "emerald-left" | "teal-right" | "center" | "emerald-right";
  className?: string;
};

const overlayStyles: Record<string, string> = {
  default:
    "radial-gradient(ellipse 100% 70% at 50% 50%, rgba(5,8,16,0.35) 0%, transparent 60%, rgba(5,150,105,0.04) 100%)",
  "emerald-left":
    "radial-gradient(ellipse 100% 70% at 50% 50%, rgba(5,8,16,0.35) 0%, transparent 60%, rgba(5,150,105,0.04) 100%)",
  "teal-right":
    "radial-gradient(ellipse 100% 70% at 50% 50%, rgba(5,8,16,0.35) 0%, transparent 60%, rgba(5,150,105,0.04) 100%)",
};

export function SectionOverlay({ variant = "default", className }: SectionOverlayProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 z-[1]", className)}
      style={{ background: overlayStyles[variant] ?? overlayStyles.default }}
      aria-hidden
    />
  );
}

type AmbientGlowProps = {
  position: "left" | "right" | "center" | "top-left" | "bottom-right";
  color?: string;
  size?: string;
  className?: string;
};

const glowPositions: Record<string, string> = {
  left: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
  right: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
  center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  "top-left": "left-1/4 top-1/3 -translate-x-1/2",
  "bottom-right": "right-1/4 bottom-1/3 translate-x-1/2 translate-y-1/2",
};

export function AmbientGlow({
  position = "center",
  color = "from-emerald/5 via-teal/5",
  size = "h-96 w-96",
  className,
}: AmbientGlowProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div
        className={`absolute rounded-full bg-gradient-to-r ${color} to-transparent blur-[120px] ${size} ${glowPositions[position]}`}
      />
    </div>
  );
}
