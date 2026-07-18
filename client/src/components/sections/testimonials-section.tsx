import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { SvgDivider } from "@/components/animations/svg-divider";
import { SectionOverlay, AmbientGlow } from "@/components/ui/section-overlay";
import { TestimonialStack } from "./testimonials/testimonial-stack";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative overflow-hidden px-6 py-28">
      <AmbientGlow position="center" color="from-emerald/5 via-teal/5" size="h-[600px] w-[600px]" />
      <SectionOverlay variant="default" />

      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
              Testimonials
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              What People <span className="text-gradient">Say</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
              Feedback from clients and collaborators who&apos;ve experienced working with me
              first-hand
            </p>
          </div>
        </ScrollReveal>

        <div className="relative mx-auto mt-16 max-w-4xl">
          <TestimonialStack />
        </div>
      </div>

      <SvgDivider />
    </section>
  );
}
