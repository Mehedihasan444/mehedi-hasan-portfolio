import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { SectionOverlay, AmbientGlow } from "@/components/ui/section-overlay";
import { techRow1, techRow2, skillCategories } from "./skills/constants";
import { MarqueeRow } from "./skills/marquee-row";

export function SkillsSection() {
  return (
    <section id="skills" className="relative overflow-hidden px-6 py-32">
      <AmbientGlow position="right" color="from-teal/5 via-emerald/5" size="h-80 w-80" />
      <SectionOverlay variant="default" />

      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
              Technology Stack
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Technical <span className="text-gradient">Skills</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
              A curated set of technologies I use to build scalable, high-performance applications
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-20 space-y-3">
            <MarqueeRow items={techRow1} />
            <MarqueeRow items={techRow2} reverse />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {skillCategories.map((category) => (
              <div key={category.name} className="group">
                <div className="mb-4 flex items-center gap-3">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/30 transition-colors duration-300 group-hover:text-white/50">
                    {category.name}
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/[0.07] to-transparent" />
                </div>
                <ul className="space-y-2">
                  {category.skills.map((skill) => (
                    <li
                      key={skill}
                      className="flex cursor-default items-center gap-2 text-sm text-white/50 transition-all duration-200 hover:text-white/90"
                    >
                      <span className="bg-emerald/50 h-1 w-1 flex-shrink-0 rounded-full" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
