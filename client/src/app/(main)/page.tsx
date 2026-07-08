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
import { ProgressiveBlur } from "@/components/animations/progressive-blur";
import { getSectionVisibility } from "@/lib/sections";

export default async function Home() {
  const s = await getSectionVisibility();

  return (
    <>
      {s.hero && <HeroSection />}
      {s.hero && s.about && <ProgressiveBlur height="20vh" />}
      {s.about && <AboutSection />}
      {s.about && s.skills && <ProgressiveBlur height="15vh" />}
      {s.skills && <SkillsSection />}
      {s.experience && <ExperienceSection />}
      {s.experience && s.projects && <ProgressiveBlur height="15vh" />}
      {s.projects && <ProjectsSection />}
      {s.education && <EducationSection />}
      {s.certifications && <CertificationsSection />}
      {s.achievements && <AchievementsSection />}
      {s.github && <GitHubSection />}
      {s.testimonials && <TestimonialsSection />}
      {s.blog && <BlogPreviewSection />}
      {s.contact && <ContactSection />}
    </>
  );
}
