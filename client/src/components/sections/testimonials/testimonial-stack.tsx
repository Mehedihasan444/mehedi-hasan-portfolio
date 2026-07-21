"use client";

import type { Testimonial } from "@/lib/api-public";
import { CardStack } from "@/components/ui/card-stack";
import { renderTestimonialCard, setTestimonials } from "./render-card";

export function TestimonialStack({ testimonials: items }: { testimonials: Testimonial[] }) {
  setTestimonials(items);

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
      cardWidth={520}
      cardHeight={340}
      responsive
      maxVisible={5}
      overlap={0.5}
      spreadDeg={40}
      activeScale={1}
      inactiveScale={0.92}
      tiltXDeg={8}
      depthPx={100}
      autoAdvance
      intervalMs={5000}
      pauseOnHover
      loop
      showDots
    />
  );
}
