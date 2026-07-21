import { getAchievements } from "@/lib/api-public";
import { ScrollReveal, StaggerReveal, RevealItem } from "@/components/animations/scroll-reveal";
import { SectionOverlay, AmbientGlow } from "@/components/ui/section-overlay";
import { metrics } from "./achievements/constants";
import { AnimatedMetric } from "./achievements/animated-metric";
import { AchievementCard } from "./achievements/achievement-card";

export async function AchievementsSection() {
  const achievements = await getAchievements();

  return (
    <section id="achievements" className="relative overflow-hidden px-6 py-24">
      <AmbientGlow position="center" color="from-emerald/5 via-teal/5" size="h-96 w-96" />
      <SectionOverlay variant="default" />

      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
              Milestones
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="text-gradient">Achievements</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {metrics.map((m, i) => (
            <AnimatedMetric key={m.label} {...m} index={i} />
          ))}
        </div>

        <StaggerReveal staggerDelay={0.12}>
          <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
            {achievements.map((item) => (
              <RevealItem key={item.id} direction="up" distance={30}>
                <AchievementCard item={item} />
              </RevealItem>
            ))}
          </div>
        </StaggerReveal>
      </div>
    </section>
  );
}
