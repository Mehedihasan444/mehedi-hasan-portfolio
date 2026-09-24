"use client";

import { useRef, useEffect, Fragment, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

gsap.registerPlugin(ScrollTrigger);

// XSS-safe inline markdown: supports `code`, **bold**, and [links](http(s)://…).
// Only http(s) URLs become <a> tags — everything else renders as plain text.
// No dangerouslySetInnerHTML anywhere.
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, pi) => {
    if (/^`[^`]+`$/.test(part)) {
      return (
        <code
          key={`${keyPrefix}-c${pi}`}
          className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-white"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const nodes: ReactNode[] = [];
    const re = /(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g;
    let last = 0;
    let k = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(part)) !== null) {
      const tok: string = m[0];
      if (m.index > last) nodes.push(part.slice(last, m.index));
      if (tok.startsWith("**")) {
        nodes.push(
          <strong key={`${keyPrefix}-b${pi}-${k++}`} className="text-white">
            {tok.slice(2, -2)}
          </strong>,
        );
      } else {
        const lm = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/.exec(tok);
        const label = lm?.[1];
        const href = lm?.[2];
        if (label && href) {
          nodes.push(
            <a
              key={`${keyPrefix}-a${pi}-${k++}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald hover:text-teal underline underline-offset-2"
            >
              {label}
            </a>,
          );
        } else {
          nodes.push(tok);
        }
      }
      last = m.index + tok.length;
    }
    if (last < part.length) nodes.push(part.slice(last));
    return <Fragment key={`${keyPrefix}-f${pi}`}>{nodes}</Fragment>;
  });
}

function renderLine(line: string, i: number) {
  if (line.startsWith("# ")) {
    return (
      <h2 key={i} className="content-reveal mt-10 text-3xl font-bold text-white">
        {renderInline(line.replace("# ", ""), `h1-${i}`)}
      </h2>
    );
  }
  if (line.startsWith("## ")) {
    return (
      <h2 key={i} className="content-reveal mt-10 text-2xl font-bold text-white">
        {renderInline(line.replace("## ", ""), `h2-${i}`)}
      </h2>
    );
  }
  if (line.startsWith("### ")) {
    return (
      <h3 key={i} className="content-reveal mt-8 text-xl font-semibold text-white">
        {renderInline(line.replace("### ", ""), `h3-${i}`)}
      </h3>
    );
  }
  if (line.startsWith("- **")) {
    const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
    if (match?.[1] && match?.[2]) {
      const label: string = match[1];
      const rest: string = match[2];
      return (
        <div key={i} className="content-reveal flex gap-3">
          <span className="bg-emerald mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
          <div>
            <strong className="text-white">{label}:</strong>{" "}
            <span className="text-muted-foreground">{renderInline(rest, `li-${i}`)}</span>
          </div>
        </div>
      );
    }
    return (
      <div key={i} className="content-reveal flex gap-3">
        <span className="bg-emerald mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
        <p className="text-muted-foreground">{line.replace(/^- \*\*|\*\*$/g, "")}</p>
      </div>
    );
  }
  if (line.startsWith("- ")) {
    return (
      <div key={i} className="content-reveal flex gap-3">
        <span className="bg-emerald mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
        <p className="text-muted-foreground">{renderInline(line.replace("- ", ""), `li-${i}`)}</p>
      </div>
    );
  }
  if (line.trim() === "") {
    return <div key={i} className="h-2" />;
  }
  return (
    <p key={i} className="content-reveal text-muted-foreground leading-relaxed">
      {renderInline(line, `p-${i}`)}
    </p>
  );
}

export function ProjectMarkdown({ content }: { content: string }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const contentEls = contentRef.current?.querySelectorAll(".content-reveal");
      if (contentEls) {
        gsap.fromTo(
          contentEls,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, contentRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative px-6 py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="from-emerald/5 via-teal/5 absolute left-1/4 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-br to-transparent blur-[120px]" />
      </div>
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <h2 className="text-gradient mb-12 text-2xl font-bold">About This Project</h2>
        </ScrollReveal>
        <div ref={contentRef} className="prose prose-invert prose-emerald max-w-none space-y-6">
          {content.split("\n").map((line, i) => renderLine(line, i))}
        </div>
      </div>
    </section>
  );
}
