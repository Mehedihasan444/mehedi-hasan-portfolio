"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (typeof window !== "undefined") {
    console.error("[App Error]", error.message, error.digest, error.stack);
  }

  const isFetchError =
    error.message?.includes("fetch") ||
    error.message?.includes("ECONN") ||
    error.message?.includes("network");
  const userMessage =
    error.digest || isFetchError
      ? "We couldn't load this page. Please check your connection and try again."
      : "Something unexpected happened. Please try again.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold text-white">Something went wrong</h1>
      <p className="text-muted-foreground mt-4">{userMessage}</p>
      {error.digest ? <p className="mt-2 text-xs text-white/40">Error ID: {error.digest}</p> : null}
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="from-emerald to-teal rounded-full bg-gradient-to-r px-8 py-3 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-teal-500/25"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-full border border-white/15 px-8 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/5"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
