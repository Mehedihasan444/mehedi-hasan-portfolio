"use client";

import Image from "next/image";
import type { CardStackItem } from "@/components/ui/card-stack";
import { Quote } from "lucide-react";
import type { Testimonial } from "@/lib/api-public";

const gradients = [
  "from-emerald to-teal",
  "from-teal to-cyan",
  "from-cyan to-emerald",
  "from-emerald to-cyan",
  "from-teal to-emerald",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

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

// Module-scope lazy cache — populated via getTestimonial() / initTestimonials(),
// never via a setState-style call during render (no render side-effect).
let cachedItems: Testimonial[] | null = null;
let cachedMap: Map<string, Testimonial> | null = null;

function getMap(items?: Testimonial[]): Map<string, Testimonial> {
  if (items && items !== cachedItems) {
    cachedItems = items;
    cachedMap = new Map(items.map((t) => [t.id, t]));
  }
  if (!cachedMap) cachedMap = new Map();
  return cachedMap;
}

/** Idempotent initializer — safe to call from useMemo/useEffect, not during render. */
export function initTestimonials(items: Testimonial[]) {
  getMap(items);
}

function getTestimonial(id: string | number): Testimonial | undefined {
  return getMap().get(String(id));
}

function isAvatarUrl(avatar: string | null): avatar is string {
  if (!avatar) return false;
  return /^(https?:\/\/|\/)/i.test(avatar.trim());
}

export function renderTestimonialCard(item: CardStackItem, { active }: { active: boolean }) {
  const t = getTestimonial(item.id);
  if (!t) return null;

  const gradient = gradients[Math.abs(hashCode(t.id)) % gradients.length];

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
        className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-[0.04]`}
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
          {isAvatarUrl(t.avatar) ? (
            <Image
              src={t.avatar}
              alt={`${t.name} avatar`}
              width={36}
              height={36}
              className="h-9 w-9 flex-shrink-0 rounded-full object-cover shadow-lg"
            />
          ) : (
            <div
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-xs font-bold text-white shadow-lg`}
              aria-hidden={Boolean(t.avatar)}
            >
              {t.avatar || getInitials(t.name)}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{t.name}</p>
            <p className="text-muted-foreground truncate text-xs">
              {t.role}
              {t.company && (
                <>
                  <span className="mx-1 text-white/20">·</span>
                  {t.company}
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}
