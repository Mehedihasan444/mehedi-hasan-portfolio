import Link from "next/link";
import type { FormattedBlogPost } from "@/lib/api-public";

export function BlogCard({ post }: { post: FormattedBlogPost }) {
  return (
    <div className="group h-full">
      <Link href={`/blog/${post.slug}`} className="block h-full">
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
  );
}
