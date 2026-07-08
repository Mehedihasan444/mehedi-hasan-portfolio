"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { ArrowUpRight, ExternalLink } from "lucide-react";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "MarketSphere",
    slug: "marketsphere",
    description:
      "A multivendor e-commerce platform with product management, cart system, payment integration, and vendor dashboards. Built with modern architecture patterns.",
    longDescription:
      "Full-featured marketplace with real-time inventory, order management, analytics dashboards, and Stripe payment processing.",
    tech: ["React", "Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    github: "https://github.com/Mehedihasan444/marketsphere-frontend",
    demo: null,
    status: "In Development",
    image: "/projects/marketsphere.png",
    featured: true,
    year: "2024",
  },
  {
    title: "Tech Tips & Tricks Hub",
    slug: "tech-tips-tricks-hub",
    description:
      "A content platform for sharing technical tutorials, tips, and tricks. Features blog posts, code snippets, and community interaction.",
    longDescription:
      "Rich content management with Markdown, syntax highlighting, upvotes, and a community engagement layer.",
    tech: ["React", "Next.js", "TypeScript", "MongoDB", "Mongoose"],
    github: "https://github.com/Mehedihasan444/tech-tips-and-tricks-hub-frontend",
    demo: null,
    status: "Completed",
    image: "/projects/techtips.png",
    featured: false,
    year: "2024",
  },
  {
    title: "Car Rental Reservation",
    slug: "car-rental-reservation-system",
    description:
      "A full-stack car rental platform with vehicle browsing, booking management, payment processing, and comprehensive admin dashboard.",
    longDescription:
      "Complete fleet management system with date-range booking, real-time availability, and admin controls.",
    tech: ["React", "TypeScript", "Node.js", "Express", "MongoDB"],
    github: "https://github.com/Mehedihasan444/Car-Rental-Reservation-System-Frontend",
    demo: null,
    status: "Completed",
    image: "/projects/carrental.png",
    featured: false,
    year: "2023",
  },
];

export function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".project-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const [featured, ...rest] = projects;

  return (
    <section ref={sectionRef} id="projects" className="relative overflow-hidden px-6 py-32">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="from-emerald/5 via-teal/5 absolute left-1/4 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-br to-transparent blur-[120px]" />
      </div>

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

        {/* Bento layout */}
        <div className="mt-16 grid gap-5 lg:grid-cols-5 lg:grid-rows-2">
          {/* Featured — large card spanning 3 cols × 2 rows */}
          {featured && (
            <div className="project-card lg:col-span-3 lg:row-span-2">
              <FeaturedCard project={featured} />
            </div>
          )}

          {/* Smaller cards */}
          {rest.map((project) => (
            <div key={project.slug} className="project-card lg:col-span-2">
              <SmallCard project={project} />
            </div>
          ))}
        </div>

        {/* View all CTA */}
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

type Project = (typeof projects)[0];

function FeaturedCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block h-full"
      aria-label={`View ${project.title} project`}
    >
      <div className="glass relative h-full min-h-[440px] overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20">
        {/* Image */}
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/40 to-transparent" />

          {/* Floating number */}
          <span className="font-heading absolute right-4 top-4 select-none text-7xl font-bold text-white/[0.07]">
            01
          </span>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald/10 text-emerald rounded-full px-3 py-1 text-xs font-medium">
                  {project.status}
                </span>
                <span className="text-muted-foreground text-xs">{project.year}</span>
              </div>
              <h3 className="group-hover:text-gradient mt-3 text-xl font-bold text-white transition-all duration-300">
                {project.title}
              </h3>
            </div>
            <div className="text-muted-foreground group-hover:border-emerald/40 group-hover:text-emerald flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition-all duration-300 group-hover:scale-110">
              <ArrowUpRight size={16} />
            </div>
          </div>

          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            {project.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-muted-foreground rounded-full bg-white/5 px-3 py-1 text-xs transition-colors group-hover:bg-white/10 group-hover:text-white"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                window.open(project.github, "_blank", "noopener,noreferrer");
              }}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  window.open(project.github!, "_blank", "noopener,noreferrer");
                }
              }}
              aria-label={`View ${project.title} on GitHub`}
              className="text-muted-foreground flex cursor-pointer items-center gap-1.5 text-xs transition-colors hover:text-white"
            >
              <GithubIcon />
              GitHub
            </span>
            {project.demo && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  window.open(project.demo!, "_blank", "noopener,noreferrer");
                }}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    window.open(project.demo!, "_blank", "noopener,noreferrer");
                  }
                }}
                aria-label={`View ${project.title} live demo`}
                className="text-muted-foreground hover:text-emerald flex cursor-pointer items-center gap-1.5 text-xs transition-colors"
              >
                <ExternalLink size={14} />
                Live Demo
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function SmallCard({ project }: { project: Project; index?: number }) {
  const num = projects.indexOf(project) + 1;
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block h-full"
      aria-label={`View ${project.title} project`}
    >
      <div className="glass relative h-full min-h-[200px] overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20">
        {/* Image thumbnail */}
        <div className="relative h-32 w-full overflow-hidden">
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/50 to-transparent" />
          <span className="font-heading absolute right-3 top-3 select-none text-5xl font-bold text-white/[0.08]">
            0{num}
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between">
            <h3 className="group-hover:text-gradient text-base font-semibold text-white transition-all duration-300">
              {project.title}
            </h3>
            <ArrowUpRight
              size={15}
              className="text-muted-foreground group-hover:text-emerald flex-shrink-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </div>
          <p className="text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed">
            {project.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-muted-foreground rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] transition-colors group-hover:bg-white/10 group-hover:text-white"
              >
                {t}
              </span>
            ))}
            {project.tech.length > 3 && (
              <span className="text-muted-foreground text-[10px]">+{project.tech.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
