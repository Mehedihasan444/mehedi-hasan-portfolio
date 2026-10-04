import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { socialLinks, contactInfo, availabilityTags, type ContactInfoItem } from "./constants";

// Shared card shell — both sidebar cards use the same glass container + hover glow.
function CardShell({
  children,
  glow = "from-emerald/5 via-teal/5",
}: {
  children: ReactNode;
  glow?: string;
}) {
  return (
    <div className="glass group relative rounded-xl p-6 transition-all duration-500 hover:border-white/20">
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${glow}`}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Lookup map replacing the nested ternary color chain.
const availabilityTagStyles: Record<string, string> = {
  Freelance: "bg-emerald/10 text-emerald",
  Remote: "bg-teal/10 text-teal",
};
const defaultTagStyle = "text-muted-foreground bg-white/5";

function ContactInfoCard() {
  return (
    <ScrollReveal direction="right" delay={0.3}>
      <CardShell>
        <h3 className="text-sm font-semibold text-white">Contact Info</h3>
        <div className="text-muted-foreground mt-5 space-y-4 text-sm">
          {contactInfo.map(({ icon: Icon, label, value, href }: ContactInfoItem) => (
            <div key={label} className="flex items-start gap-3">
              <div className="bg-emerald/10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
                <Icon className="text-emerald h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-white/50">
                  {label}
                </span>
                {href ? (
                  <a
                    href={href}
                    className="hover:text-emerald mt-0.5 block min-w-0 break-all transition-colors"
                  >
                    {value}
                  </a>
                ) : (
                  <span className="mt-0.5 block text-white/70">{value}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardShell>
    </ScrollReveal>
  );
}

function AvailabilityCard() {
  return (
    <ScrollReveal direction="right" delay={0.45}>
      <CardShell glow="from-teal/5 via-emerald/5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="bg-emerald/70 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
            <span className="bg-emerald relative inline-flex h-2 w-2 rounded-full" />
          </span>
          <h3 className="text-emerald text-sm font-semibold">Currently Available</h3>
        </div>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          Open for freelance projects and full-time opportunities. Typical response time{" "}
          <span className="text-white">within 24 hours</span>.
        </p>

        <div className="mt-4 flex gap-2">
          {availabilityTags.map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-3 py-1 text-xs ${availabilityTagStyles[tag] ?? defaultTagStyle}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3 border-t border-white/[0.07] pt-5">
          {socialLinks.map(({ icon: Icon, label, href, color }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={`text-muted-foreground flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 transition-all duration-300 hover:scale-110 hover:border-white/20 hover:bg-white/5 ${color}`}
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </CardShell>
    </ScrollReveal>
  );
}

export function ContactSidebar() {
  return (
    <div className="space-y-5 lg:col-span-2">
      <ContactInfoCard />
      <AvailabilityCard />
    </div>
  );
}
