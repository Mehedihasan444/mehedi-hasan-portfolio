"use client";

import { Briefcase, CalendarDays, MapPin } from "lucide-react";
import { formatPeriod } from "@/lib/date";
import type { FormattedExperience } from "@/lib/api-public";

export function ExperienceCard({ exp }: { exp: FormattedExperience }) {
  const current = !!exp.current;
  const description = exp.description?.trim() ? exp.description.trim() : null;

  return (
    <div className="glass group relative rounded-2xl p-8 transition-all duration-500 hover:border-white/20">
      <div className="from-emerald/5 via-teal/5 absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="flex flex-wrap items-start gap-4 sm:flex-nowrap">
          <div className="from-emerald/20 to-teal/10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-105">
            <Briefcase className="text-emerald h-7 w-7" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold text-white">{exp.role}</h3>
              {current && (
                <span className="bg-teal/10 text-teal flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="bg-teal/70 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                    <span className="bg-teal relative inline-flex h-1.5 w-1.5 rounded-full" />
                  </span>
                  Current
                </span>
              )}
            </div>
            <p className="text-muted-foreground mt-1 font-medium">{exp.company}</p>
          </div>

          <span className="bg-emerald/10 text-emerald flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
            <CalendarDays size={10} />
            {formatPeriod(exp.startDate, exp.endDate)}
          </span>
        </div>

        {exp.location && (
          <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <MapPin size={12} />
              {exp.location}
            </span>
          </div>
        )}

        {description && <p className="text-muted-foreground mt-5 leading-relaxed">{description}</p>}

        {exp.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {exp.tags.map((tag) => (
              <span
                key={tag}
                className="text-muted-foreground rounded-full bg-white/5 px-3 py-1 text-xs transition-colors hover:bg-white/10 hover:text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
