"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const skillCategories = [
  {
    name: "Frontend",
    skills: [
      { name: "React", level: 90 },
      { name: "Next.js", level: 85 },
      { name: "TypeScript", level: 85 },
      { name: "Tailwind CSS", level: 90 },
      { name: "Redux", level: 80 },
    ],
  },
  {
    name: "Backend",
    skills: [
      { name: "Node.js", level: 85 },
      { name: "Express.js", level: 85 },
      { name: "Python", level: 65 },
      { name: "Java", level: 60 },
    ],
  },
  {
    name: "Database",
    skills: [
      { name: "PostgreSQL", level: 80 },
      { name: "MongoDB", level: 80 },
      { name: "Prisma", level: 80 },
      { name: "Mongoose", level: 75 },
    ],
  },
  {
    name: "Tools",
    skills: [
      { name: "Git", level: 85 },
      { name: "Docker", level: 60 },
      { name: "C", level: 55 },
      { name: "C++", level: 55 },
    ],
  },
];

export function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.3], [0.9, 1]);

  return (
    <section ref={ref} id="skills" className="relative overflow-hidden px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-widest">
            Technology Stack
          </p>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Technical <span className="text-gradient">Skills</span>
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            Expertise in modern web technologies and development practices, building scalable and
            performant applications
          </p>
        </motion.div>

        <motion.div style={{ scale }} className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((category, i) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass rounded-xl p-6"
            >
              <h3 className="text-muted-foreground mb-6 text-sm font-medium uppercase tracking-wider">
                {category.name}
              </h3>
              <div className="space-y-4">
                {category.skills.map((skill) => (
                  <SkillBar key={skill.name} name={skill.name} level={skill.level} />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SkillBar({ name, level }: { name: string; level: number }) {
  const barRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{name}</span>
        <span className="text-white">{level}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="from-cyan to-purple h-full rounded-full bg-gradient-to-r"
        />
      </div>
    </div>
  );
}
