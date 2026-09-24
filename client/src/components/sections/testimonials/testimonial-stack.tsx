"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import type { Testimonial } from "@/lib/api-public";
import { CardStack } from "@/components/ui/card-stack";
import { renderTestimonialCard, initTestimonials } from "./render-card";

export function TestimonialStack({ testimonials: items }: { testimonials: Testimonial[] }) {
  // Populate the module-scope card cache outside of render's commit phase —
  // useMemo (not a bare call) so there is no render side-effect.
  useMemo(() => {
    initTestimonials(items);
  }, [items]);
  // Pause autoplay for users who prefer reduced motion (CardStack also guards
  // internally via useReducedMotion — this makes the intent explicit at the call site).
  const reduceMotion = useReducedMotion();

  const cardItems = items.map((t) => ({
    id: t.id,
    title: t.name,
    description: t.content,
    tag: [t.role, t.company].filter(Boolean).join(" · "),
  }));

  return (
    <CardStack
      items={cardItems}
      renderCard={renderTestimonialCard}
      // Base size; actual width/height scale down via CSS (responsive + container).
      cardWidth={520}
      cardHeight={340}
      responsive
      className="mx-auto w-full max-w-[520px]"
      maxVisible={5}
      overlap={0.5}
      spreadDeg={40}
      activeScale={1}
      inactiveScale={0.92}
      tiltXDeg={8}
      depthPx={100}
      autoAdvance={!reduceMotion}
      intervalMs={5000}
      pauseOnHover
      loop
      showDots
    />
  );
}
