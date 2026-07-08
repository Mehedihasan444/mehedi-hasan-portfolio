"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollReveal, StaggerReveal, RevealItem } from "@/components/animations/scroll-reveal";
import { AnimatedCounterGroup } from "@/components/animations/animated-counter";
import { useParallax } from "@/hooks/use-parallax";
import { Code2, Lightbulb, Microscope, Puzzle } from "lucide-react";
import { ElegantShape } from "@/components/ui/shape-landing-hero";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { end: 1, suffix: "+", label: "Years Experience" },
  { end: 10, suffix: "+", label: "Projects Completed" },
  { end: 18, suffix: "+", label: "Technologies" },
  { end: 5, suffix: "+", label: "Open Source" },
];

const values = [
  {
    Icon: Code2,
    title: "Clean Code Advocate",
    desc: "Passionate about writing maintainable, efficient, and scalable code that stands the test of time",
    gradient: "from-emerald/20 to-teal/10",
    color: "text-emerald",
  },
  {
    Icon: Lightbulb,
    title: "Innovation Driven",
    desc: "Always exploring emerging technologies and pushing boundaries to deliver exceptional results",
    gradient: "from-teal/20 to-cyan/10",
    color: "text-teal",
  },
  {
    Icon: Microscope,
    title: "Detail Oriented",
    desc: "Pixel-perfect implementation with meticulous attention to performance and user experience",
    gradient: "from-cyan/20 to-emerald/10",
    color: "text-cyan",
  },
  {
    Icon: Puzzle,
    title: "Problem Solver",
    desc: "Analytical mindset focused on breaking down complex problems into elegant solutions",
    gradient: "from-emerald/20 to-cyan/10",
    color: "text-violet-soft",
  },
];

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useParallax<HTMLDivElement>({ speed: 0.3 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const paragraphs = textRef.current?.querySelectorAll(".reveal-text");
      if (paragraphs) {
        paragraphs.forEach((p) => {
          const text = p.textContent || "";
          p.innerHTML = "";
          text.split(" ").forEach((word, i) => {
            const span = document.createElement("span");
            span.textContent = word;
            span.style.display = "inline-block";
            span.style.opacity = "0";
            span.style.transform = "translateY(18px)";
            (p as HTMLElement).appendChild(span);
            if (i < text.split(" ").length - 1) {
              const space = document.createTextNode("\u00A0");
              (p as HTMLElement).appendChild(space);
            }
          });

          gsap.to(p.querySelectorAll("span"), {
            opacity: 1,
            y: 0,
            stagger: 0.025,
            duration: 0.55,
            ease: "power3.out",
            scrollTrigger: {
              trigger: p,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        });
      }

      // Rounded-top rise effect
      if (sectionRef.current) {
        gsap.fromTo(
          sectionRef.current,
          { y: 30 },
          {
            y: 0,
            ease: "power2.out",
            duration: 0.8,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, textRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-background relative z-10 overflow-hidden rounded-t-[3rem] px-6 py-32"
      style={{ marginTop: "clamp(-10rem, -15vh, -4rem)" }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="from-emerald/5 via-teal/5 absolute left-0 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r to-transparent blur-[150px]" />
      </div>

      {/* Floating shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.2}
          width={520}
          height={130}
          rotate={10}
          gradient="from-emerald/[0.25]"
          className="left-[-8%] top-[12%] -z-10"
        />

        <ElegantShape
          delay={0.4}
          width={420}
          height={110}
          rotate={-12}
          gradient="from-teal/[0.2]"
          className="right-[-4%] top-[65%]"
        />

        <ElegantShape
          delay={0.3}
          width={280}
          height={80}
          rotate={-6}
          gradient="from-cyan/[0.2]"
          className="bottom-[8%] left-[8%]"
        />

        <ElegantShape
          delay={0.5}
          width={200}
          height={55}
          rotate={18}
          gradient="from-emerald/[0.2]"
          className="right-[10%] top-[8%]"
        />

        <ElegantShape
          delay={0.6}
          width={150}
          height={40}
          rotate={-22}
          gradient="from-cyan/[0.18]"
          className="left-[22%] top-[4%]"
        />
      </div>

      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
            About Me
          </p>
        </ScrollReveal>

        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left: text */}
          <div>
            <ScrollReveal direction="left" delay={0.2}>
              <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Turning complex problems into{" "}
                <span className="text-gradient">elegant solutions</span>
              </h2>
            </ScrollReveal>

            <div ref={textRef} className="text-muted-foreground mt-8 space-y-4 leading-relaxed">
              <p className="reveal-text">
                With over 1+ years of experience in full-stack development, I&apos;m dedicated to
                creating elegant solutions to complex problems. My journey in technology is driven
                by a passion for innovation and a commitment to excellence in every project I
                undertake.
              </p>
              <p className="reveal-text">
                I specialize in building scalable web applications using React, Next.js, Node.js,
                and TypeScript. Every project is an opportunity to push boundaries, learn new
                things, and deliver exceptional results that make a real impact.
              </p>
            </div>

            <div className="mt-12">
              <AnimatedCounterGroup items={stats} />
            </div>
          </div>

          {/* Right: avatar */}
          <div ref={imageRef} className="relative flex items-center justify-center">
            <ScrollReveal direction="right" delay={0.3}>
              <div className="relative h-80 w-80 sm:h-96 sm:w-96">
                {/* Outer glow rings */}
                <div className="from-emerald/30 via-teal/30 animate-pulse-slow absolute -inset-4 rounded-full bg-gradient-to-br to-transparent blur-3xl" />
                <div
                  className="from-emerald/20 via-teal/20 animate-spin-slow absolute inset-0 rounded-full bg-gradient-to-br to-transparent blur-2xl"
                  style={{ animationDuration: "8s" }}
                />

                {/* Avatar card — photo only */}
                <div className="glow-border relative h-full w-full overflow-hidden rounded-2xl">
                  <Image
                    src="/mehedi_hasan.jpg"
                    alt="Mehedi Hasan"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 320px, 384px"
                    priority
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Values grid */}
        <div className="mt-32">
          <ScrollReveal>
            <h3 className="text-muted-foreground mb-12 text-center text-sm font-medium uppercase tracking-[0.3em]">
              What Defines Me
            </h3>
          </ScrollReveal>

          <StaggerReveal staggerDelay={0.1}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((item) => (
                <RevealItem key={item.title} direction="up" distance={40}>
                  <div className="glass glass-hover group relative rounded-xl p-6 transition-all duration-500">
                    <div
                      className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                    />
                    <div className="relative z-10">
                      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 transition-all duration-300 group-hover:bg-white/10">
                        <item.Icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <h3 className="font-medium text-white">{item.title}</h3>
                      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </div>
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}
