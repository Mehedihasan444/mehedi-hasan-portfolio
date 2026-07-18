import { ScrollReveal, StaggerReveal, RevealItem } from "@/components/animations/scroll-reveal";
import { SvgDivider } from "@/components/animations/svg-divider";
import { education } from "./education/constants";
import { EducationCard } from "./education/education-card";

export function EducationSection() {
  return (
    <section id="education" className="relative overflow-hidden px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
              Learning
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="text-gradient">Education</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="mx-auto mt-16 max-w-4xl">
          <StaggerReveal staggerDelay={0.2}>
            {education.map((edu, i) => (
              <RevealItem key={i} direction="up" distance={40}>
                <EducationCard edu={edu} />
              </RevealItem>
            ))}
          </StaggerReveal>
        </div>
      </div>
      <SvgDivider />
    </section>
  );
}
