"use client";

import { CardStack } from "@/components/ui/card-stack";
import { testimonialCards } from "./constants";
import { renderTestimonialCard } from "./render-card";

export function TestimonialStack() {
  return (
    <CardStack
      items={testimonialCards}
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
