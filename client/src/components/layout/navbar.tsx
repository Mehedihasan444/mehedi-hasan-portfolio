"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X, Code2, Briefcase, MessageCircle } from "lucide-react";

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const socialLinks = [
  { href: "https://github.com/Mehedihasan444", icon: Code2, label: "GitHub" },
  {
    href: "https://linkedin.com/in/mehedi-hasan-893500301",
    icon: Briefcase,
    label: "LinkedIn",
  },
  { href: "https://twitter.com/MEHEDIH60833052", icon: MessageCircle, label: "Twitter" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { scrollY } = useScroll();

  const navBg = useTransform(scrollY, [0, 80], ["rgba(5, 8, 16, 0)", "rgba(5, 8, 16, 0.85)"]);
  const navBorder = useTransform(
    scrollY,
    [0, 80],
    ["rgba(5, 150, 105, 0)", "rgba(5, 150, 105, 0.12)"],
  );
  const navBlur = useTransform(scrollY, [0, 80], [0, 1]);

  // Active section tracking
  const updateActive = useCallback(() => {
    const sections = navLinks.map((l) => l.href.replace("#", ""));
    const scrollPos = window.scrollY + 120;
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el && scrollPos >= el.offsetTop) {
        setActiveSection(sections[i]);
        return;
      }
    }
    setActiveSection("hero");
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, [updateActive]);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <>
      <motion.header
        className="fixed left-0 right-0 top-0 z-50"
        style={{
          backgroundColor: navBg,
          borderBottomColor: navBorder,
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
        }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: navBlur, backdropFilter: "blur(20px) saturate(180%)" }}
        />
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#hero");
            }}
            className="group flex items-center gap-2.5"
            aria-label="Mehedi Hasan — Home"
          >
            <div className="border-violet/30 from-violet/20 to-cyan/10 group-hover:border-violet/60 group-hover:shadow-violet/20 relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border bg-gradient-to-br transition-all duration-300 group-hover:shadow-lg">
              <span className="font-heading text-gradient text-sm font-bold">MH</span>
            </div>
            <span className="font-heading text-foreground/80 group-hover:text-foreground hidden text-sm font-semibold transition-colors sm:block">
              Mehedi<span className="text-violet">.</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {navLinks.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={cn(
                    "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-300",
                    isActive ? "text-violet-soft" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="bg-violet/10 absolute inset-0 rounded-lg"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden items-center gap-3 lg:flex">
            {socialLinks.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-muted-foreground hover:bg-violet/10 hover:text-violet-soft flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300"
              >
                <s.icon size={16} />
              </a>
            ))}
            <div className="h-4 w-px bg-white/10" />
            <a
              href="mailto:mehedihasan67705251@gmail.com"
              className="from-violet to-cyan shadow-violet/25 hover:shadow-violet/40 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r px-4 py-1.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105"
            >
              Hire Me
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="text-muted-foreground hover:border-violet/30 hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 transition-all duration-300 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="bg-[#050810]/98 fixed inset-0 z-40 flex flex-col backdrop-blur-xl lg:hidden"
          >
            {/* Close button area */}
            <div className="flex items-center justify-between px-6 py-4">
              <span className="font-heading text-gradient text-sm font-bold">MH</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-muted-foreground flex h-9 w-9 items-center justify-center rounded-lg border border-white/10"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav links */}
            <nav
              className="flex flex-1 flex-col justify-center px-8"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link, i) => {
                const id = link.href.replace("#", "");
                const isActive = activeSection === id;
                return (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    onClick={() => scrollTo(link.href)}
                    className={cn(
                      "font-heading flex items-center gap-3 py-4 text-2xl font-semibold transition-all duration-300",
                      isActive ? "text-violet-soft" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="text-violet/60 font-mono text-xs tabular-nums">0{i + 1}</span>
                    {link.label}
                  </motion.button>
                );
              })}
            </nav>

            {/* Social + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-6 px-8 pb-12"
            >
              <div className="flex gap-4">
                {socialLinks.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-muted-foreground hover:border-violet/30 hover:text-violet-soft flex h-10 w-10 items-center justify-center rounded-xl border border-white/10"
                  >
                    <s.icon size={18} />
                  </a>
                ))}
              </div>
              <a
                href="mailto:mehedihasan67705251@gmail.com"
                className="from-violet to-cyan inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r py-3 text-base font-semibold text-white"
              >
                Get In Touch
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
