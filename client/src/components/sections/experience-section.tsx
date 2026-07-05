"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const experiences = [
  {
    period: "2024 - Present",
    role: "Full Stack Developer",
    company: "Freelance / Self-Employed",
    description:
      "Building scalable web applications for clients using React, Next.js, Node.js, and modern technologies. Delivering end-to-end solutions from conception to deployment.",
    tags: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL"],
  },
];

export function ExperienceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <section ref={ref} id="experience" className="relative overflow-hidden px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-widest">
            Career
          </p>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Work <span className="text-gradient">Experience</span>
          </h2>
        </motion.div>

        <div className="relative mt-16">
          <div className="absolute left-8 top-0 h-full w-px bg-white/5 md:left-1/2 md:-translate-x-px">
            <motion.div
              style={{ height: lineHeight }}
              className="from-cyan via-purple w-full bg-gradient-to-b to-transparent"
            />
          </div>

          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`relative mb-12 pl-16 md:w-1/2 md:pl-0 ${
                i % 2 === 0 ? "md:pr-16 md:text-right" : "md:ml-auto md:pl-16"
              }`}
            >
              <div
                className={`border-cyan bg-background absolute left-7 top-1 h-3 w-3 rounded-full border-2 md:left-auto ${
                  i % 2 === 0 ? "md:right-0 md:translate-x-1/2" : "md:left-8"
                }`}
              />

              <div className="glass rounded-xl p-6">
                <span className="text-cyan text-xs font-medium">{exp.period}</span>
                <h3 className="mt-2 text-lg font-semibold text-white">{exp.role}</h3>
                <p className="text-muted-foreground text-sm">{exp.company}</p>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {exp.description}
                </p>
                <div className={`mt-4 flex flex-wrap gap-2 ${i % 2 === 0 ? "md:justify-end" : ""}`}>
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-muted-foreground rounded-full bg-white/5 px-3 py-1 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
