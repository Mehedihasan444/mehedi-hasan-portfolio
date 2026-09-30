"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certs" },
  { id: "achievements", label: "Awards" },
  { id: "github", label: "GitHub" },
  { id: "testimonials", label: "Testimonials" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const [activeSection, setActiveSection] = useState("hero");
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount/external-system sync
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { threshold: 0.3 },
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {!reducedMotion && (
        <div className="fixed bottom-0 left-0 top-0 z-50 hidden w-px md:block" aria-hidden>
          <motion.div
            className="from-emerald via-teal w-full origin-top bg-gradient-to-b to-transparent"
            style={{ scaleY }}
          />
        </div>
      )}

      <div className="fixed bottom-24 left-4 z-50 hidden flex-col items-center gap-2 md:flex">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="group flex items-center gap-3">
            <span
              className={`block h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                activeSection === s.id
                  ? "from-emerald to-teal shadow-copper-500/25 bg-gradient-to-r shadow-lg"
                  : "bg-white/20 group-hover:bg-white/40"
              }`}
            />
            <span
              className={`text-xs transition-all duration-300 ${
                activeSection === s.id
                  ? "text-white opacity-100"
                  : "text-muted-foreground opacity-0 group-hover:opacity-100"
              }`}
            >
              {s.label}
            </span>
          </a>
        ))}
      </div>
    </>
  );
}
