function requiredEnv(name: string, fallback?: string): string {
  const v = process.env[name];
  if (v && v.length > 0) return v;
  if (fallback && process.env.NODE_ENV !== "production") return fallback;
  if (typeof window === "undefined") {
    throw new Error(`Missing required env: ${name}`);
  }
  return fallback ?? "";
}

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mehedi-hasan.dev";
export const SITE_TITLE = "Mehedi Hasan — Full Stack Developer & Software Engineer";
export const SITE_DESCRIPTION =
  "Full Stack Developer & Software Engineer based in Dhaka, Bangladesh. Specializing in React, Next.js, Node.js, TypeScript, and modern web technologies. Building scalable, high-performance applications.";

export const EMAIL = "mehedihasan67705251@gmail.com";
export const PHONE = "+8801767705251";

export const SOCIAL_LINKS = {
  github: "https://github.com/Mehedihasan444",
  linkedin: "https://linkedin.com/in/mehedi-hasan-893500301",
  twitter: "https://x.com/MEHEDIH60833052",
} as const;

export const NAV_LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
] as const;

export const DEFAULT_SECTIONS = [
  "hero",
  "about",
  "skills",
  "experience",
  "projects",
  "education",
  "certifications",
  "achievements",
  "github",
  "testimonials",
  "blog",
  "contact",
] as const;

export { requiredEnv };
