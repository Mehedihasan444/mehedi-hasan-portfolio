import Link from "next/link";
import type { Metadata } from "next";
import { getBlogPosts, type FormattedBlogPost } from "@/lib/api-public";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { ArrowLeftIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, tutorials, and insights about web development and software engineering.",
};

export default async function BlogPage() {
  let published: FormattedBlogPost[] = [];
  let loadError = false;
  try {
    const posts = await getBlogPosts();
    published = posts.filter((p) => p.published);
  } catch {
    loadError = true;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050810] px-6 pb-24 pt-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="from-emerald/5 via-teal/5 absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-b to-transparent blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-muted-foreground hover:text-emerald group mb-8 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <ScrollReveal>
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
              Thoughts, tutorials, and insights about web development, technology, and software
              engineering.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-16 space-y-8">
          {loadError ? (
            <p className="py-20 text-center text-sm text-red-400" role="alert">
              Couldn&apos;t load posts. Please try again later.
            </p>
          ) : (
            published.map((post) => <BlogCard key={post.slug} post={post} />)
          )}
          {!loadError && published.length === 0 && (
            <p className="text-muted-foreground py-20 text-center text-sm">No posts yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}

function BlogCard({ post }: { post: FormattedBlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="glass rounded-xl border border-white/5 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/20">
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
        <h2 className="group-hover:text-gradient mt-4 text-xl font-bold text-white transition-all duration-300">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-muted-foreground mt-2 leading-relaxed">{post.excerpt}</p>
        )}
        <div className="text-muted-foreground group-hover:text-emerald mt-4 flex items-center gap-1 text-sm transition-colors">
          <span>Read more</span>
          <svg
            aria-hidden="true"
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
      </article>
    </Link>
  );
}
