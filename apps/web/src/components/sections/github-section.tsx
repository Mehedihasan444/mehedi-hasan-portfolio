import Link from "next/link";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { GithubIcon } from "@/components/ui/icons";
import { SectionOverlay, AmbientGlow } from "@/components/ui/section-overlay";
import { GitHubStats } from "./github/github-stats";
import { LanguageBreakdown } from "./github/language-breakdown";
import { ContributionHeatmap } from "./github/contribution-heatmap";

export function GitHubSection() {
  return (
    <section id="github" className="relative overflow-hidden px-6 py-24">
      <AmbientGlow position="right" color="from-emerald/5" size="h-80 w-80" />
      <SectionOverlay variant="default" />

      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
              Open Source
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              GitHub <span className="text-gradient">Statistics</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
              My open source contributions and coding activity across various projects
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <GitHubStats />
        </ScrollReveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <LanguageBreakdown />

          <ScrollReveal direction="right" delay={0.3}>
            <div className="glass group relative rounded-xl p-6 transition-all duration-500 hover:border-white/20">
              <div className="from-teal/5 via-emerald/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium text-white">Contribution Activity</h3>
                  <span className="text-muted-foreground text-xs">Last 6 months</span>
                </div>
                <ContributionHeatmap />
                <div className="text-muted-foreground mt-4 flex items-center gap-2 text-xs">
                  <span>Less</span>
                  <div className="flex gap-1">
                    {[
                      "bg-white/[0.04]",
                      "bg-emerald/20",
                      "bg-emerald/40",
                      "bg-emerald/65",
                      "bg-emerald",
                    ].map((c) => (
                      <div key={c} className={`h-3 w-3 rounded-sm ${c}`} />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.4}>
          <div className="mt-8 text-center">
            <Link
              href="https://github.com/Mehedihasan444"
              target="_blank"
              rel="noopener noreferrer"
              className="from-emerald to-teal hover:shadow-emerald/25 group inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <GithubIcon className="h-4 w-4" aria-hidden />
              View GitHub Profile
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
