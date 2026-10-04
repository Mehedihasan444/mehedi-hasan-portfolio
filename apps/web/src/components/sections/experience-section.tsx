import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { getExperiences } from "@/lib/api-public";
import { TimelineLine } from "./experience/timeline-line";
import { TimelineCard } from "./experience/timeline-card";

export async function ExperienceSection() {
  const experiences = await getExperiences();

  return (
    <section id="experience" className="relative overflow-hidden px-6 py-32">
      <div className="mx-auto w-full min-w-0 max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
              Career
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Work <span className="text-gradient">Experience</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
              My professional journey building impactful products and growing as an engineer
            </p>
          </div>
        </ScrollReveal>

        <div className="relative mt-20 min-w-0">
          <div className="absolute left-5 top-0 h-full w-[18px] translate-x-[-2px] sm:left-8 md:left-1/2 md:-translate-x-1/2">
            <TimelineLine />
          </div>

          {experiences.map((exp, i) => (
            <TimelineCard key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
