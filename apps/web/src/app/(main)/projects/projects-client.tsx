"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { FormattedProject } from "@/lib/api-public";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { ArrowUpRight, Search } from "lucide-react";
import { ArrowLeftIcon } from "@/components/ui/icons";

function useDebounced(value: string, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function ProjectsClient({ initialProjects }: { initialProjects: FormattedProject[] }) {
  const [projects] = useState<FormattedProject[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const debouncedSearch = useDebounced(search, 200);

  const allTechs = useMemo(
    () => ["All", ...Array.from(new Set(projects.flatMap((p) => p.techStack)))].slice(0, 30),
    [projects],
  );

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q);
      const matchesFilter = activeFilter === "All" || project.techStack.includes(activeFilter);
      return matchesSearch && matchesFilter;
    });
  }, [projects, debouncedSearch, activeFilter]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050810] px-6 pb-24 pt-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="from-emerald/5 via-teal/5 absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-b to-transparent blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <Link
          href="/"
          className="text-muted-foreground hover:text-emerald group mb-8 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <ScrollReveal>
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              All <span className="text-gradient">Projects</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
              Explore my portfolio of web applications, tools, and developer resources. Use the
              filters to search by technology.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 flex flex-col gap-6 border-b border-white/[0.08] pb-8 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 overflow-hidden">
            <div
              className="scrollbar-none flex gap-2 overflow-x-auto scroll-smooth pb-2 md:pb-0"
              role="group"
              aria-label="Filter by technology"
            >
              {allTechs.map((tech) => (
                <button
                  key={tech}
                  onClick={() => setActiveFilter(tech)}
                  aria-pressed={activeFilter === tech}
                  className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    activeFilter === tech
                      ? "text-white"
                      : "text-muted-foreground bg-white/[0.02] hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  {activeFilter === tech && (
                    <motion.div
                      layoutId="activeFilterBg"
                      className="from-emerald to-teal absolute inset-0 -z-10 rounded-full bg-gradient-to-r"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {tech}
                </button>
              ))}
            </div>
            {allTechs.length > 8 && (
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#050810] to-transparent md:hidden" />
            )}
          </div>

          <div className="relative w-full max-w-xs">
            <label htmlFor="project-search" className="sr-only">
              Search projects
            </label>
            <Search
              aria-hidden="true"
              className="text-muted-foreground/50 absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
            />
            <input
              id="project-search"
              type="search"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
              className="placeholder:text-muted-foreground/30 focus:border-emerald/50 focus:ring-emerald/20 w-full rounded-full border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-xs text-white transition-all duration-300 focus:outline-none focus:ring-1"
            />
          </div>
        </div>

        {projects.length === 0 ? (
          <p className="text-muted-foreground py-20 text-center text-sm" role="status">
            Couldn&apos;t load projects. Please try again later.
          </p>
        ) : (
          <motion.div layout className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, idx) => (
                <motion.div
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 20 }}
                  transition={{
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                    delay: Math.min(idx, 6) * 0.05,
                  }}
                  className="group"
                >
                  <Link href={`/projects/${project.slug}`} className="block h-full">
                    <div className="glass relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20">
                      <div className="relative h-48 w-full overflow-hidden">
                        {project.image ? (
                          <Image
                            src={project.image}
                            alt={`${project.title} screenshot`}
                            fill
                            loading="lazy"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="from-emerald/10 to-teal/10 absolute inset-0 bg-gradient-to-br" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/40 to-transparent" />
                        <span
                          aria-hidden="true"
                          className="font-heading absolute right-4 top-4 select-none text-5xl font-bold text-white/[0.08]"
                        >
                          0{idx + 1}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="group-hover:text-gradient text-lg font-bold text-white transition-all duration-300">
                            {project.title}
                          </h3>
                          <ArrowUpRight
                            aria-hidden="true"
                            size={16}
                            className="text-muted-foreground group-hover:text-emerald flex-shrink-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </div>
                        <p className="text-muted-foreground mt-3 line-clamp-3 flex-1 text-sm leading-relaxed">
                          {project.description}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-1.5">
                          {project.techStack.map((t) => (
                            <span
                              key={t}
                              className="text-muted-foreground rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] transition-colors group-hover:bg-white/10 group-hover:text-white"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {projects.length > 0 && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground py-20 text-center text-sm"
            role="status"
          >
            No projects found matching the criteria.
          </motion.div>
        )}
      </div>
    </main>
  );
}
