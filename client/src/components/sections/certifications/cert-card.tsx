import { BadgeCheck, ExternalLink, CalendarDays, GraduationCap } from "lucide-react";
import type { Certification } from "@/lib/api-public";

export function CertCard({ cert }: { cert: Certification }) {
  const year = cert.date ? new Date(cert.date).getFullYear().toString() : "";

  return (
    <div className="group h-full">
      <div className="glass relative flex h-full flex-col rounded-xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/20">
        <div className="from-emerald/5 via-teal/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 transition-transform duration-300 group-hover:scale-110">
              <GraduationCap className="text-emerald h-6 w-6" aria-hidden="true" />
            </div>
            {cert.url && (
              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Verify ${cert.title} credential`}
                className="text-muted-foreground hover:border-emerald/40 hover:text-emerald flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 transition-all duration-300"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>

          <div className="mt-4 flex-1">
            {year && (
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <CalendarDays size={10} />
                {year}
              </div>
            )}
            <h3 className="mt-2 font-semibold leading-snug text-white">{cert.title}</h3>
            <p className="text-muted-foreground mt-1 text-xs font-medium">{cert.issuer}</p>
            {cert.description && (
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {cert.description}
              </p>
            )}
          </div>

          {cert.url ? (
            <div className="text-emerald mt-4 flex items-center gap-1.5 text-xs">
              <BadgeCheck size={14} aria-hidden="true" />
              <span>Verified Certificate</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
