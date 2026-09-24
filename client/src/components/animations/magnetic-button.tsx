"use client";

import { useRef, type ReactNode, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({ children, className = "", strength = 0.3 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [magnetic, setMagnetic] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- feature-detect then enable
    setMagnetic(true);
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!magnetic) return;
      const el = ref.current;
      const inner = innerRef.current;
      if (!el || !inner) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      inner.style.transform = `translate(${x}px, ${y}px)`;
      inner.style.transition = "transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)";
    },
    [strength, magnetic],
  );

  const onMouseLeave = useCallback(() => {
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.transform = "translate(0px, 0px)";
    inner.style.transition = "transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)";
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={magnetic ? onMouseMove : undefined}
      onMouseLeave={magnetic ? onMouseLeave : undefined}
      whileHover={magnetic ? { scale: 1.03 } : undefined}
      whileTap={{ scale: 0.97 }}
      className={`inline-block ${className}`}
    >
      <div ref={innerRef} className="inline-block">
        {children}
      </div>
    </motion.div>
  );
}
