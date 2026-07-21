import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { FormattedProject } from "@/lib/api-public";

export function SmallCard({ project, num }: { project: FormattedProject; num: number }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block h-full"
      aria-label={`View ${project.title} project`}
    >
      <div className="glass relative h-full min-h-[200px] overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20">
        <div className="relative h-32 w-full overflow-hidden">
          <Image
            src={project.image || "/projects/techtips.webp"}
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
            {project.techStack.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-muted-foreground rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] transition-colors group-hover:bg-white/10 group-hover:text-white"
              >
                {t}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="text-muted-foreground text-[10px]">+{project.techStack.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
