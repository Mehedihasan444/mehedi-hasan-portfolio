import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/api-public";
import { SITE_URL } from "@/lib/constants";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { BlogContent } from "./blog-content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts();
    return posts
      .filter((p) => p.published)
      .slice(0, 20)
      .map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const clean = decodeURIComponent(slug || "").trim();
  if (!clean) return { title: "Post Not Found", robots: { index: false } };
  const post = await getBlogPostBySlug(clean);

  if (!post) return { title: "Post Not Found", robots: { index: false } };

  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt || post.title,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt || post.title,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      images: post.image ? [{ url: post.image }] : [{ url: "/og-image.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || post.title,
      images: post.image ? [post.image] : ["/og-image.png"],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const clean = decodeURIComponent(slug || "").trim();
  if (!clean) notFound();
  const post = await getBlogPostBySlug(clean);

  if (!post) notFound();

  return (
    <main className="relative min-h-screen bg-[#050810] px-6 pb-24 pt-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="from-emerald/5 via-teal/5 absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-gradient-to-b to-transparent blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-emerald group mb-8 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Blog
        </Link>

        <ScrollReveal>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </p>
        </ScrollReveal>

        <BlogContent content={post.content} />
      </div>
    </main>
  );
}
