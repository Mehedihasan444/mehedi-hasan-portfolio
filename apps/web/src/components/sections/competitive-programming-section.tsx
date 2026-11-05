import { ExternalLink } from "lucide-react";
import { ScrollReveal, StaggerReveal, RevealItem } from "@/components/animations/scroll-reveal";
import { SectionOverlay, AmbientGlow } from "@/components/ui/section-overlay";
import { getCompetitiveProfiles, getCompetitiveStats } from "@/lib/api-public";
import {
  cpVisualFor,
  fallbackCpProfiles,
  fallbackCpStats,
  type CPProfileData,
  type CPStatData,
} from "./competitive-programming/constants";

export async function CompetitiveProgrammingSection() {
  const [apiProfiles, apiStats] = await Promise.all([
    getCompetitiveProfiles(),
    getCompetitiveStats(),
  ]);

  // API-first with static fallback (same pattern as SkillsSection): admin
  // dashboard content wins, the constants file covers API-down/build time.
  const profiles: CPProfileData[] = (
    apiProfiles.length > 0
      ? [...apiProfiles]
          .sort((a, b) => a.order - b.order)
          .map((p) => ({
            platform: p.platform,
            handle: p.handle,
            url: p.url,
            stat: p.stat,
            detail: p.detail,
            badge: p.badge,
          }))
      : fallbackCpProfiles
  ).filter((p) => p.platform.trim().length > 0);

  const stats: CPStatData[] =
    apiStats.length > 0
      ? [...apiStats]
          .sort((a, b) => a.order - b.order)
          .map((s) => ({ value: s.value, label: s.label }))
      : fallbackCpStats;

  if (profiles.length === 0 && stats.length === 0) return null;

  return (
    <section id="competitive-programming" className="relative overflow-hidden px-6 py-24">
      <AmbientGlow position="center" color="from-emerald/5 via-teal/5" size="h-96 w-96" />
      <SectionOverlay variant="default" />

      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
              Problem Solving
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Competitive <span className="text-gradient">Programming</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
              Sharpening data structures, algorithms, and speed through rated contests and daily
              problem solving
            </p>
          </div>
        </ScrollReveal>

        {stats.length > 0 && (
          <ScrollReveal delay={0.1}>
            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="glass rounded-xl p-5 text-center transition-all duration-500 hover:-translate-y-0.5 hover:border-white/20"
                >
                  <div className="font-heading text-gradient text-2xl font-bold">{s.value}</div>
                  <div className="text-muted-foreground mt-1 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {profiles.length > 0 && (
          <StaggerReveal staggerDelay={0.12}>
            <div className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2">
              {profiles.map((p) => {
                const visual = cpVisualFor(p.platform);
                return (
                  <RevealItem key={p.platform} direction="up" distance={30}>
                    <div className="group h-full">
                      <div className="glass relative flex h-full flex-col rounded-xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/20">
                        <div className="from-emerald/5 via-teal/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <div className="relative z-10 flex h-full flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`${visual.chip} flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110`}
                              >
                                <visual.icon
                                  className={`h-6 w-6 ${visual.accent}`}
                                  aria-hidden="true"
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold leading-tight text-white">
                                  {p.platform}
                                </h3>
                                {p.handle && (
                                  <p className="text-muted-foreground mt-0.5 text-xs">{p.handle}</p>
                                )}
                              </div>
                            </div>
                            {p.url && (
                              <a
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Open ${p.platform} profile (opens in a new tab)`}
                                className="text-muted-foreground hover:border-emerald/40 hover:text-emerald flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 transition-all duration-300"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                          </div>

                          <div className="mt-4 flex-1">
                            {p.stat && <p className="text-sm font-medium text-white">{p.stat}</p>}
                            {p.detail && (
                              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                                {p.detail}
                              </p>
                            )}
                          </div>

                          {p.badge && (
                            <div className="mt-4">
                              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/80">
                                {p.badge}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </RevealItem>
                );
              })}
            </div>
          </StaggerReveal>
        )}
      </div>
    </section>
  );
}
