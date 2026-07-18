import { ScrollReveal, StaggerReveal, RevealItem } from "@/components/animations/scroll-reveal";
import { SvgDivider } from "@/components/animations/svg-divider";
import { certifications } from "./certifications/constants";
import { CertCard } from "./certifications/cert-card";

export function CertificationsSection() {
  return (
    <section id="certifications" className="relative overflow-hidden px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
              Credentials
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="text-gradient">Certifications</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
              Professional certifications that validate my expertise and commitment to continuous
              learning
            </p>
          </div>
        </ScrollReveal>

        <StaggerReveal staggerDelay={0.12}>
          <div className="mx-auto mt-16 grid max-w-5xl gap-5 md:grid-cols-3">
            {certifications.map((cert, i) => (
              <RevealItem key={i} direction="up" distance={30}>
                <CertCard cert={cert} />
              </RevealItem>
            ))}
          </div>
        </StaggerReveal>
      </div>
      <SvgDivider />
    </section>
  );
}
