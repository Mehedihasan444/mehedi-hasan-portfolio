import { Suspense, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { EducationSection } from "@/components/sections/education-section";
import { CertificationsSection } from "@/components/sections/certifications-section";
import { AchievementsSection } from "@/components/sections/achievements-section";
import { GitHubSection } from "@/components/sections/github-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { BlogPreviewSection } from "@/components/sections/blog-preview-section";
import { OrbitSection } from "@/components/sections/orbit-section";
import { ContactSection } from "@/components/sections/contact-section";
import { SectionErrorBoundary } from "@/components/layout/section-error-boundary";
import { getSectionVisibility } from "@/lib/sections";

const ProgressiveBlur = dynamic(
  () =>
    import("@/components/animations/progressive-blur").then((m) => ({
      default: m.ProgressiveBlur,
    })),
  { loading: () => <div className="h-[15vh]" /> },
);

const SectionFallback = ({ height = "100vh" }: { height?: string }) => (
  <div className="flex items-center justify-center px-6 py-32" style={{ minHeight: height }}>
    <div className="border-emerald/30 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
  </div>
);

function Section({
  label,
  height,
  children,
}: {
  label: string;
  height?: string;
  children: ReactNode;
}) {
  return (
    <SectionErrorBoundary label={label}>
      <Suspense fallback={<SectionFallback height={height} />}>{children}</Suspense>
    </SectionErrorBoundary>
  );
}

export default async function Home() {
  const s = await getSectionVisibility();

  return (
    <>
      {s.hero && (
        <Section label="hero">
          <HeroSection />
        </Section>
      )}
      {s.hero && s.about && <ProgressiveBlur height="20vh" />}
      {s.about && (
        <Section label="about">
          <AboutSection />
        </Section>
      )}
      {s.about && s.orbit && <ProgressiveBlur height="15vh" />}
      {s.orbit && (
        <Section label="orbit" height="100vh">
          <OrbitSection />
        </Section>
      )}
      {s.orbit && s.skills && <ProgressiveBlur height="15vh" />}
      {s.skills && (
        <Section label="skills" height="60vh">
          <SkillsSection />
        </Section>
      )}
      {s.experience && (
        <Section label="experience" height="60vh">
          <ExperienceSection />
        </Section>
      )}
      {s.experience && s.projects && <ProgressiveBlur height="15vh" />}
      {s.projects && (
        <Section label="projects">
          <ProjectsSection />
        </Section>
      )}
      {s.education && (
        <Section label="education" height="60vh">
          <EducationSection />
        </Section>
      )}
      {s.certifications && (
        <Section label="certifications" height="60vh">
          <CertificationsSection />
        </Section>
      )}
      {s.achievements && (
        <Section label="achievements" height="60vh">
          <AchievementsSection />
        </Section>
      )}
      {s.github && (
        <Section label="github" height="60vh">
          <GitHubSection />
        </Section>
      )}
      {s.testimonials && (
        <Section label="testimonials" height="60vh">
          <TestimonialsSection />
        </Section>
      )}
      {s.blog && (
        <Section label="blog" height="60vh">
          <BlogPreviewSection />
        </Section>
      )}
      {s.contact && (
        <Section label="contact" height="80vh">
          <ContactSection />
        </Section>
      )}
    </>
  );
}
