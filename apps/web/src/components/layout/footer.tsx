"use client";

import Link from "next/link";
import { TextHoverEffect, FooterBackgroundGradient } from "@/components/ui/hover-footer";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/Mehedihasan444", external: true },
  { label: "LinkedIn", href: "https://linkedin.com/in/mehedi-hasan-893500301", external: true },
  { label: "Twitter", href: "https://x.com/MEHEDIH60833052", external: true },
  { label: "Email", href: "mailto:mehedihasan67705251@gmail.com", external: false },
];

const quickLinks = [
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[oklch(0.04_0.01_260/0.5)]">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 pb-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Link href="/" className="text-lg font-semibold">
              <span className="text-gradient">MH</span>
            </Link>
            <p className="text-muted-foreground mt-4 max-w-xs text-sm leading-relaxed">
              Full Stack Developer passionate about creating exceptional web experiences with modern
              technologies and best practices. Always learning, always building.
            </p>
          </div>

          <nav aria-label="Quick links">
            <h3 className="text-sm font-medium text-white">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground inline-flex min-h-11 items-center text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Social links">
            <h3 className="text-sm font-medium text-white">Connect</h3>
            <ul className="mt-4 space-y-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    aria-label={
                      link.external ? `${link.label} (opens in a new tab)` : `Email ${link.label}`
                    }
                    className="text-muted-foreground inline-flex min-h-11 items-center text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-white/5 pt-8 text-center">
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} Mehedi Hasan. Built with precision.
          </p>
        </div>
      </div>

      {/* Text hover effect — decorative SVG with a plain-text fallback for AT/no-JS. */}
      <div className="pointer-events-none relative z-10 -mb-28 -mt-40 flex h-[20rem] select-none items-center justify-center">
        <TextHoverEffect text="Mehedi" className="pointer-events-auto" />
        <span className="sr-only">Mehedi</span>
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}
