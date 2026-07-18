import { BadgeCheck, ExternalLink, CalendarDays } from "lucide-react";

interface CertItem {
  title: string;
  issuer: string;
  date: string;
  description: string;
  credentialUrl: string | null;
  issuerColor: string;
  badge: string;
}

export function CertCard({ cert }: { cert: CertItem }) {
  return (
    <div className="group h-full">
      <div className="glass relative flex h-full flex-col rounded-xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/20">
        <div className="from-emerald/5 via-teal/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-2xl transition-transform duration-300 group-hover:scale-110">
              {cert.badge}
            </div>
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Verify ${cert.title} credential`}
                className="text-muted-foreground hover:border-emerald/40 hover:text-emerald flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition-all duration-300"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>

          <div className="mt-4 flex-1">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <CalendarDays size={10} />
              {cert.date}
            </div>
            <h3 className="mt-2 font-semibold leading-snug text-white">{cert.title}</h3>
            <p className="text-muted-foreground mt-1 text-xs font-medium">{cert.issuer}</p>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{cert.description}</p>
          </div>

          <div className="text-emerald mt-4 flex items-center gap-1.5 text-xs">
            <BadgeCheck size={14} />
            <span>Verified Certificate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
