"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold text-white">Something went wrong</h1>
      <p className="text-muted-foreground mt-4">{error.message}</p>
      <button
        onClick={reset}
        className="from-cyan to-purple mt-8 rounded-full bg-gradient-to-r px-8 py-3 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-purple-500/25"
      >
        Try Again
      </button>
    </div>
  );
}
