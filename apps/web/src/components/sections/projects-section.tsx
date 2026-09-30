import { WorkTrack } from "./projects/work-track";
import { getProjects } from "@/lib/api-public";

export async function ProjectsSection() {
  const projects = await getProjects();
  // Ascending `order` everywhere (matches skills-section). Featured-first: the
  // featured project leads, remaining projects follow in ascending order.
  // Mirrors the reference work section, which showcases the first five.
  const sorted = [...projects]
    .filter((p) => p.status === "published")
    .sort((a, b) => a.order - b.order);
  const featured = sorted.filter((p) => p.featured);
  const rest = sorted.filter((p) => !p.featured);
  const showcase = [...featured, ...rest].slice(0, 5);

  if (showcase.length === 0) {
    return (
      <section id="projects" className="relative px-6 py-32">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-[0.3em]">
            Portfolio
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            My <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-muted-foreground mt-8 text-sm" role="status">
            No featured projects yet — check back soon.
          </p>
        </div>
      </section>
    );
  }

  return <WorkTrack projects={showcase} />;
}
