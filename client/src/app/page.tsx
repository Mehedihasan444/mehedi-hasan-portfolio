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

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProgressiveBlur height="20vh" />
      <AboutSection />
      <ProgressiveBlur height="15vh" />
      <SkillsSection />
      <ExperienceSection />
      <ProgressiveBlur height="15vh" />
      <ProjectsSection />
      <EducationSection />
      <CertificationsSection />
      <AchievementsSection />
      <GitHubSection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <ContactSection />
    </>
  );
}
