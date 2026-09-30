import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { SectionOverlay, AmbientGlow } from "@/components/ui/section-overlay";
import { getSkills } from "@/lib/api-public";
import { MarqueeRow } from "./skills/marquee-row";
import { techRow1, techRow2, skillCategories } from "./skills/constants";

export async function SkillsSection() {
  const skills = await getSkills();
  const sorted = [...skills].sort((a, b) => a.order - b.order);

  const useFallback = sorted.length === 0;

  const categories: Record<string, string[]> = useFallback
    ? Object.fromEntries(skillCategories.map((c) => [c.name, c.skills]))
    : sorted.reduce(
        (acc, skill) => {
          const cat = skill.category || "Other";
          if (!acc[cat]) acc[cat] = [];
          acc[cat]?.push(skill.name);
          return acc;
        },
        {} as Record<string, string[]>,
      );

  const names = useFallback
    ? [...techRow1.map((t) => t.name), ...techRow2.map((t) => t.name)]
    : sorted.map((s) => s.name);
  const mid = Math.ceil(names.length / 2);
  const row1 = useFallback ? techRow1.map((t) => t.name) : names.slice(0, mid);
  const row2 = useFallback ? techRow2.map((t) => t.name) : names.slice(mid);

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

        {row1.length > 0 && (
          <ScrollReveal delay={0.2}>
            <div className="mt-20 space-y-3">
              <MarqueeRow items={row1} label="Primary technologies" />
              {row2.length > 0 && <MarqueeRow items={row2} label="Additional technologies" />}
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal delay={0.4}>
          <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(categories).map(([name, skillNames]) => (
              <div key={name} className="group">
                <div className="mb-4 flex items-center gap-3">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/30 transition-colors duration-300 group-hover:text-white/50">
                    {name}
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/[0.07] to-transparent" />
                </div>
                <ul className="space-y-2">
                  {skillNames.map((skill) => (
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
