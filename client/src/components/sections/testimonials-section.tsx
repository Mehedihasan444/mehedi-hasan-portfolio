"use client";

import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { SvgDivider } from "@/components/animations/svg-divider";
import { CardStack } from "@/components/ui/card-stack";
import type { CardStackItem } from "@/components/ui/card-stack";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Client Feedback",
    role: "Product Owner",
    company: "Web Development Project",
    avatar: "CF",
    content:
      "Outstanding work on the project. The attention to detail and commitment to quality was evident throughout the entire development process. Delivered ahead of schedule with exceptional results that exceeded all expectations.",
    rating: 5,
    gradient: "from-emerald to-teal",
  },
  {
    name: "Team Collaboration",
    role: "Engineering Lead",
    company: "Open Source Project",
    avatar: "TC",
    content:
      "A highly skilled developer who brings both technical expertise and creative problem-solving to every project. Great communication and a genuine passion for building quality software that makes a real impact.",
    rating: 5,
    gradient: "from-teal to-cyan",
  },
  {
    name: "Project Delivery",
    role: "Startup Founder",
    company: "SaaS Platform",
    avatar: "PD",
    content:
      "Mehedi transformed our idea into a production-ready application with clean architecture, beautiful UI, and excellent performance. His expertise in full-stack development is top-notch — truly a 10x developer.",
    rating: 5,
    gradient: "from-cyan to-emerald",
  },
];

const testimonialCards: CardStackItem[] = testimonials.map((t, i) => ({
  id: i,
  title: t.name,
  description: t.content,
  tag: `${t.role} · ${t.company}`,
}));

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < count ? "text-amber fill-current" : "fill-current text-white/10"}`}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard(item: CardStackItem, { active }: { active: boolean }) {
  const t = testimonials[item.id as number];
  if (!t) return null;

  return (
    <div
      className={`relative h-full w-full rounded-2xl p-6 transition-all duration-500 sm:p-8 ${
        active
          ? "bg-[rgba(6,14,10,0.6)] backdrop-blur-xl"
          : "bg-[rgba(6,14,10,0.35)] backdrop-blur-md"
      }`}
      style={{ border: "1px solid rgba(5,150,105,0.12)" }}
    >
      <div
        className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${t.gradient} opacity-[0.04]`}
        aria-hidden
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between">
          <div className="bg-emerald/10 flex h-9 w-9 items-center justify-center rounded-xl">
            <Quote className="text-emerald h-4 w-4" />
          </div>
          <StarRating count={t.rating} />
        </div>

        <blockquote className="text-muted-foreground mt-4 flex-1 text-sm leading-relaxed sm:text-base">
          &ldquo;{t.content}&rdquo;
        </blockquote>

        <div className="mt-auto flex items-center gap-3 border-t border-white/[0.07] pt-4">
          <div
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-xs font-bold text-white shadow-lg`}
          >
            {t.avatar}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{t.name}</p>
            <p className="text-muted-foreground truncate text-xs">
              {t.role}
              <span className="mx-1 text-white/20">·</span>
              {t.company}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative overflow-hidden px-6 py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="from-emerald/5 via-teal/5 absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r to-transparent blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
              Testimonials
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              What People <span className="text-gradient">Say</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
              Feedback from clients and collaborators who&apos;ve experienced working with me
              first-hand
            </p>
          </div>
        </ScrollReveal>

        <div className="relative mx-auto mt-16 max-w-4xl">
          <CardStack
            items={testimonialCards}
            renderCard={TestimonialCard}
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
        </div>
      </div>

      <SvgDivider />
    </section>
  );
}
