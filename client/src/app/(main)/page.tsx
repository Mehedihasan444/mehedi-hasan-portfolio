import { Suspense } from "react";
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
import { ContactSection } from "@/components/sections/contact-section";
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

export default async function Home() {
  const s = await getSectionVisibility();

  return (
    <>
      {s.hero && (
        <Suspense fallback={<SectionFallback />}>
          <HeroSection />
        </Suspense>
      )}
      {s.hero && s.about && <ProgressiveBlur height="20vh" />}
      {s.about && (
        <Suspense fallback={<SectionFallback />}>
          <AboutSection />
        </Suspense>
      )}
      {s.about && s.skills && <ProgressiveBlur height="15vh" />}
      {s.skills && (
        <Suspense fallback={<SectionFallback height="60vh" />}>
          <SkillsSection />
        </Suspense>
      )}
      {s.experience && (
        <Suspense fallback={<SectionFallback height="60vh" />}>
          <ExperienceSection />
        </Suspense>
      )}
      {s.experience && s.projects && <ProgressiveBlur height="15vh" />}
      {s.projects && (
        <Suspense fallback={<SectionFallback />}>
          <ProjectsSection />
        </Suspense>
      )}
      {s.education && (
        <Suspense fallback={<SectionFallback height="60vh" />}>
          <EducationSection />
        </Suspense>
      )}
      {s.certifications && (
        <Suspense fallback={<SectionFallback height="60vh" />}>
          <CertificationsSection />
        </Suspense>
      )}
      {s.achievements && (
        <Suspense fallback={<SectionFallback height="60vh" />}>
          <AchievementsSection />
        </Suspense>
      )}
      {s.github && (
        <Suspense fallback={<SectionFallback height="60vh" />}>
          <GitHubSection />
        </Suspense>
      )}
      {s.testimonials && (
        <Suspense fallback={<SectionFallback height="60vh" />}>
          <TestimonialsSection />
        </Suspense>
      )}
      {s.blog && (
        <Suspense fallback={<SectionFallback height="60vh" />}>
          <BlogPreviewSection />
        </Suspense>
      )}
      {s.contact && (
        <Suspense fallback={<SectionFallback height="80vh" />}>
          <ContactSection />
        </Suspense>
      )}
    </>
  );
}
