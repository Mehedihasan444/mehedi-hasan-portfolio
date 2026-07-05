export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="border-cyan h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}
