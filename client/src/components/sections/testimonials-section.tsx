"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { SvgDivider } from "@/components/animations/svg-divider";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

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

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const total = testimonials.length;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goTo = useCallback(
    (i: number) => {
      setDirection(i > activeIndex ? 1 : -1);
      setActiveIndex(i);
    },
    [activeIndex],
  );

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(goNext, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, goNext]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.94,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -120 : 120,
      opacity: 0,
      scale: 0.94,
    }),
  };

  const t = testimonials[activeIndex];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden px-6 py-28"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="from-emerald/5 via-teal/5 absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r to-transparent blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
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

        {/* Carousel */}
        <div className="relative mx-auto mt-16 max-w-3xl">
          {/* Card */}
          <div className="relative min-h-[320px] overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <div className="glass relative rounded-2xl p-8 sm:p-10">
                  {/* Gradient overlay on hover */}
                  <div
                    className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${t.gradient} opacity-[0.04]`}
                    aria-hidden
                  />

                  {/* Top row: quote icon + stars */}
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="bg-emerald/10 flex h-10 w-10 items-center justify-center rounded-xl">
                      <Quote className="text-emerald h-5 w-5" />
                    </div>
                    <StarRating count={t.rating} />
                  </div>

                  {/* Content */}
                  <blockquote className="text-muted-foreground relative z-10 mt-6 text-base leading-relaxed sm:text-lg">
                    &ldquo;{t.content}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="relative z-10 mt-8 flex items-center gap-4 border-t border-white/[0.07] pt-6">
                    <div
                      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-sm font-bold text-white shadow-lg`}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {t.role}
                        <span className="mx-1.5 text-white/20">·</span>
                        {t.company}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-between">
            {/* Prev */}
            <button
              onClick={goPrev}
              aria-label="Previous testimonial"
              className="text-muted-foreground hover:border-emerald/40 hover:bg-emerald/5 hover:text-emerald flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial slides">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={activeIndex === i}
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`duration-400 h-2 rounded-full transition-all ${
                    activeIndex === i
                      ? "from-emerald to-teal w-7 bg-gradient-to-r"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={goNext}
              aria-label="Next testimonial"
              className="text-muted-foreground hover:border-emerald/40 hover:bg-emerald/5 hover:text-emerald flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <SvgDivider />
    </section>
  );
}
