"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const stats = [
  { label: "Experience", value: "1+" },
  { label: "Projects", value: "10+" },
  { label: "Technologies", value: "15+" },
  { label: "Open Source", value: "5+" },
];

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} id="about" className="relative overflow-hidden px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-widest"
        >
          About Me
        </motion.div>

        <div className="grid gap-16 lg:grid-cols-2">
          <motion.div style={{ y, opacity }}>
            <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Turning complex problems into <span className="text-gradient">elegant solutions</span>
            </h2>

            <div className="text-muted-foreground mt-8 space-y-4 leading-relaxed">
              <p>
                With over 1+ years of experience in full-stack development, I&apos;m dedicated to
                creating elegant solutions to complex problems. My journey in technology is driven
                by a passion for innovation and a commitment to excellence.
              </p>
              <p>
                I specialize in building scalable web applications using React, Next.js, Node.js,
                and TypeScript. Every project is an opportunity to push boundaries and deliver
                exceptional results.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-muted-foreground mt-1 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative h-80 w-80 sm:h-96 sm:w-96">
              <div className="from-cyan/20 via-purple/20 absolute inset-0 rounded-full bg-gradient-to-br to-transparent blur-3xl" />
              <div className="glass glow-border flex h-full w-full items-center justify-center rounded-2xl">
                <div className="text-center">
                  <div className="text-gradient text-6xl font-bold">MH</div>
                  <div className="text-muted-foreground mt-2 text-sm">Full Stack Developer</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Clean Code Advocate",
              desc: "Passionate about writing maintainable, efficient, and scalable code",
            },
            {
              title: "Team Player",
              desc: "Strong believer in collaboration and knowledge sharing",
            },
            {
              title: "Innovation Driven",
              desc: "Always exploring new technologies and best practices",
            },
            {
              title: "Fast Learner",
              desc: "Quick to adapt and master new technologies and frameworks",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass glass-hover rounded-xl p-6"
            >
              <h3 className="font-medium text-white">{item.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
