import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ScrollReveal, StaggerReveal, RevealItem } from "@/components/animations/scroll-reveal";
import { SectionOverlay, AmbientGlow } from "@/components/ui/section-overlay";
import { FeaturedCard } from "./projects/featured-card";
import { SmallCard } from "./projects/small-card";
import { getProjects } from "@/lib/api-public";

export async function ProjectsSection() {
  const projects = await getProjects();
  const sorted = [...projects].sort((a, b) => b.order - a.order);
  const featured = sorted.find((p) => p.featured) || sorted[0];
  const rest = sorted.filter((p) => p.slug !== featured?.slug).slice(0, 2);

  return (
    <section id="projects" className="relative overflow-hidden px-6 py-32">
      <AmbientGlow position="center" color="from-emerald/5 via-teal/5" size="h-96 w-96" />
      <SectionOverlay variant="default" />

      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
              Portfolio
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
              A selection of projects that showcase my skills and passion for building exceptional
              digital experiences
            </p>
          </div>
        </ScrollReveal>

        {featured && (
          <StaggerReveal staggerDelay={0.15}>
            <div className="mt-16 grid gap-5 lg:grid-cols-5 lg:grid-rows-2">
              <div className="lg:col-span-3 lg:row-span-2">
                <RevealItem direction="up" distance={50}>
                  <FeaturedCard project={featured} />
                </RevealItem>
              </div>
              {rest.map((project, i) => (
                <div key={project.slug} className="lg:col-span-2">
                  <RevealItem direction="up" distance={50}>
                    <SmallCard project={project} num={i + 2} />
                  </RevealItem>
                </div>
              ))}
            </div>
          </StaggerReveal>
        )}

        <ScrollReveal delay={0.4}>
          <div className="mt-12 text-center">
            <Link
              href="https://github.com/Mehedihasan444"
              target="_blank"
              rel="noopener noreferrer"
              className="from-emerald to-teal hover:shadow-emerald/25 group inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              View All Projects on GitHub
              <ExternalLink
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
