import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { SectionOverlay, AmbientGlow } from "@/components/ui/section-overlay";
import { getGuestbookEntries } from "@/lib/api-public";
import { GuestbookClient } from "./guestbook/guestbook-client";

export async function GuestbookSection() {
  const entries = await getGuestbookEntries();

  return (
    <section id="guestbook" className="relative overflow-hidden px-6 py-24">
      <AmbientGlow position="left" color="from-emerald/5 via-teal/5" size="h-96 w-96" />
      <SectionOverlay variant="default" />

      <div className="mx-auto w-full min-w-0 max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
              Guestbook
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Sign the <span className="text-gradient">Guestbook</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
              Stopped by? Leave a short note — feedback, hellos, and collaboration ideas are all
              welcome.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <GuestbookClient initialEntries={entries} />
        </ScrollReveal>
      </div>
    </section>
  );
}
