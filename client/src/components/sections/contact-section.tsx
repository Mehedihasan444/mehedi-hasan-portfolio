import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { SectionOverlay, AmbientGlow } from "@/components/ui/section-overlay";
import { ContactForm } from "./contact/contact-form";
import { ContactSidebar } from "./contact/contact-sidebar";

export function ContactSection() {
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-32">
      <AmbientGlow position="right" color="from-emerald/5 via-teal/5" size="h-96 w-96" />
      <AmbientGlow position="left" color="from-teal/5" size="h-64 w-64" />
      <SectionOverlay variant="default" />

      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
              Contact
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Let&apos;s <span className="text-gradient">Connect</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
              Have a project in mind or want to collaborate? I&apos;d love to hear from you.
              Let&apos;s create something amazing together.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
          <ContactSidebar />
        </div>
      </div>
    </section>
  );
}
