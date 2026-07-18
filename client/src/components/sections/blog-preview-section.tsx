import Link from "next/link";
import { ScrollReveal, StaggerReveal, RevealItem } from "@/components/animations/scroll-reveal";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { blogPosts } from "./blog-preview/constants";
import { BlogCard } from "./blog-preview/blog-card";

export function BlogPreviewSection() {
  return (
    <section id="blog" className="relative overflow-hidden px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
              Articles
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Latest <span className="text-gradient">Blog Posts</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
              Thoughts, tutorials, and insights about web development, technology, and software
              engineering
            </p>
          </div>
        </ScrollReveal>

        <StaggerReveal staggerDelay={0.15}>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {blogPosts.map((post, i) => (
              <RevealItem key={i} direction="up" distance={40}>
                <BlogCard post={post} />
              </RevealItem>
            ))}
          </div>
        </StaggerReveal>

        <ScrollReveal delay={0.4}>
          <div className="mt-10 text-center">
            <MagneticButton>
              <Link
                href="/blog"
                className="from-emerald to-teal inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/25"
              >
                View All Posts
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </MagneticButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
