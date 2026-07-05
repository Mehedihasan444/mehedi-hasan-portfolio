import Link from "next/link";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/Mehedihasan444" },
  { label: "LinkedIn", href: "https://linkedin.com/in/mehedi-hasan-893500301" },
  { label: "Twitter", href: "https://twitter.com/MEHEDIH60833052" },
  { label: "Email", href: "mailto:mehedihasan67705251@gmail.com" },
];

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[oklch(0.04_0.01_260/0.5)]">
      <div className="mx-auto max-w-7xl px-6 py-16">
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

          <div>
            <h3 className="text-sm font-medium text-white">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white">Connect</h3>
            <ul className="mt-4 space-y-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8 text-center">
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} Mehedi Hasan. Built with precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
