import { ScrollReveal, StaggerReveal, RevealItem } from "@/components/animations/scroll-reveal";
import { AnimatedCounterGroup } from "@/components/animations/animated-counter";
import { ElegantShape } from "@/components/ui/shape-landing-hero";
import { SectionOverlay, AmbientGlow } from "@/components/ui/section-overlay";
import { stats, values } from "./about/constants";
import { WordRevealText } from "./about/word-reveal-text";
import { ParallaxImage } from "./about/parallax-image";
import { ValueCard } from "./about/value-card";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative z-10 overflow-hidden rounded-t-[3rem] px-6 py-32"
      style={{ marginTop: "clamp(-10rem, -15vh, -4rem)" }}
    >
      <AmbientGlow
        position="left"
        color="from-emerald/5 via-teal/5"
        size="h-96 w-96"
        className="pointer-events-none absolute inset-0"
      />
      <SectionOverlay variant="default" />

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

      <div className="mx-auto w-full min-w-0 max-w-7xl">
        <ScrollReveal>
          <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
            About Me
          </p>
        </ScrollReveal>

        <div className="grid min-w-0 gap-12 sm:gap-16 lg:grid-cols-2">
          <div className="min-w-0">
            <ScrollReveal direction="left" delay={0.2}>
              <h2 className="text-balance break-words text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
                Turning complex problems into{" "}
                <span className="text-gradient">elegant solutions</span>
              </h2>
            </ScrollReveal>

            <div className="text-muted-foreground mt-8 space-y-4 leading-relaxed">
              <WordRevealText>
                With over 1+ years of experience in full-stack development, I&apos;m dedicated to
                creating elegant solutions to complex problems. My journey in technology is driven
                by a passion for innovation and a commitment to excellence in every project I
                undertake.
              </WordRevealText>
              <WordRevealText>
                I specialize in building scalable web applications using React, Next.js, Node.js,
                and TypeScript. Every project is an opportunity to push boundaries, learn new
                things, and deliver exceptional results that make a real impact.
              </WordRevealText>
            </div>

            <div className="mt-12">
              <AnimatedCounterGroup items={stats} />
            </div>
          </div>

          <ScrollReveal direction="right" delay={0.3}>
            <ParallaxImage />
          </ScrollReveal>
        </div>

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
                  <ValueCard item={item} />
                </RevealItem>
              ))}
            </div>
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}
