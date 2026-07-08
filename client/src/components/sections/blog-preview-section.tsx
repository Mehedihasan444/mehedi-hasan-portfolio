"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { MagneticButton } from "@/components/animations/magnetic-button";

gsap.registerPlugin(ScrollTrigger);

export function BlogPreviewSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".blog-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="blog" className="relative overflow-hidden px-6 py-24">
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

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Building Scalable Web Apps",
              excerpt:
                "Best practices for building scalable and maintainable web applications with modern technologies.",
              tags: ["Architecture", "Next.js"],
            },
            {
              title: "Mastering TypeScript",
              excerpt:
                "Advanced TypeScript patterns and techniques for production-ready code in large codebases.",
              tags: ["TypeScript", "JavaScript"],
            },
            {
              title: "Modern CSS Techniques",
              excerpt:
                "Exploring modern CSS features like container queries, layers, and advanced animations.",
              tags: ["CSS", "Frontend"],
            },
          ].map((post, i) => (
            <div key={i} className="blog-card group">
              <Link href="/blog" className="block">
                <div className="glass relative h-full rounded-xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/20">
                  <div className="from-emerald/5 via-teal/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-muted-foreground rounded-full bg-white/5 px-2.5 py-0.5 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="group-hover:text-gradient mt-4 text-lg font-semibold text-white transition-all duration-300">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="text-muted-foreground group-hover:text-emerald mt-4 flex items-center gap-1 text-sm transition-colors">
                      <span>Read more</span>
                      <svg
                        className="h-3 w-3 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

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
