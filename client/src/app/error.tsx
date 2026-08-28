"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log full error for debugging, but show user-friendly message
  if (typeof window !== "undefined") {
    console.error("[App Error]", error.message, error.digest);
  }

  const userMessage =
    error.digest || error.message?.includes("fetch") || error.message?.includes("ECONN")
      ? "We couldn't load this page. Please check your connection and try again."
      : "Something unexpected happened. Please try again.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold text-white">Something went wrong</h1>
      <p className="text-muted-foreground mt-4">{userMessage}</p>
      <button
        onClick={reset}
        className="from-emerald to-teal mt-8 rounded-full bg-gradient-to-r px-8 py-3 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-teal-500/25"
      >
        Try Again
      </button>
    </div>
  );
}
