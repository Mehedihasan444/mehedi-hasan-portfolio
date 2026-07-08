"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollReveal, StaggerReveal, RevealItem } from "@/components/animations/scroll-reveal";
import { SvgDivider } from "@/components/animations/svg-divider";
import { BadgeCheck, ExternalLink, CalendarDays } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const certifications = [
  {
    title: "Complete Web Development",
    issuer: "Programming Hero",
    date: "2023",
    description:
      "Full-stack web development with React, Node.js, Express, MongoDB and modern tooling",
    credentialUrl: null,
    issuerColor: "#9b59b6",
    badge: "🎓",
  },
  {
    title: "JavaScript Algorithms & Data Structures",
    issuer: "FreeCodeCamp",
    date: "2023",
    description: "Advanced algorithm design, data structures, and problem solving with JavaScript",
    credentialUrl: "https://freecodecamp.org",
    issuerColor: "#0a0a23",
    badge: "🧮",
  },
  {
    title: "Responsive Web Design",
    issuer: "FreeCodeCamp",
    date: "2022",
    description: "Modern CSS layouts, Flexbox, Grid, and responsive design patterns",
    credentialUrl: "https://freecodecamp.org",
    issuerColor: "#0a0a23",
    badge: "📱",
  },
];

export function CertificationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".cert-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="certifications" className="relative overflow-hidden px-6 py-24">
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
                <div className="cert-card group h-full">
                  <div className="glass relative flex h-full flex-col rounded-xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/20">
                    <div className="from-emerald/5 via-teal/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative z-10 flex h-full flex-col">
                      {/* Badge & icon */}
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-2xl transition-transform duration-300 group-hover:scale-110">
                          {cert.badge}
                        </div>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Verify ${cert.title} credential`}
                            className="text-muted-foreground hover:border-emerald/40 hover:text-emerald flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition-all duration-300"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>

                      {/* Content */}
                      <div className="mt-4 flex-1">
                        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                          <CalendarDays size={10} />
                          {cert.date}
                        </div>
                        <h3 className="mt-2 font-semibold leading-snug text-white">{cert.title}</h3>
                        <p className="text-muted-foreground mt-1 text-xs font-medium">
                          {cert.issuer}
                        </p>
                        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                          {cert.description}
                        </p>
                      </div>

                      {/* Verified badge */}
                      <div className="text-emerald mt-4 flex items-center gap-1.5 text-xs">
                        <BadgeCheck size={14} />
                        <span>Verified Certificate</span>
                      </div>
                    </div>
                  </div>
                </div>
              </RevealItem>
            ))}
          </div>
        </StaggerReveal>
      </div>
      <SvgDivider />
    </section>
  );
}
