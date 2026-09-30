export default function Loading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          aria-hidden="true"
          className="border-emerald h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"
        />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}
