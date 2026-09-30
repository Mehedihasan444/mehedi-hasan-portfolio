import Link from "next/link";
import type { FormattedBlogPost } from "@/lib/api-public";

function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function BlogCard({ post }: { post: FormattedBlogPost }) {
  const minutes = readingTime(post.content);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="glass group relative block h-full rounded-xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/20"
    >
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
        <p className="text-muted-foreground mt-2 text-xs">
          <time dateTime={post.createdAt}>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
          <span aria-hidden="true"> · </span>
          <span>{minutes} min read</span>
        </p>
        <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">{post.excerpt}</p>
        <div className="text-muted-foreground group-hover:text-emerald mt-4 flex items-center gap-1 text-sm transition-colors">
          <span>Read more</span>
          <svg
            className="h-3 w-3 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
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
    </Link>
  );
}
