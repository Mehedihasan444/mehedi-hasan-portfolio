export default function ProjectsLoading() {
  return (
    <main className="relative min-h-screen bg-[#050810] px-6 pb-24 pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" />
        <div className="mt-6 h-6 w-96 animate-pulse rounded-lg bg-white/5" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-white/[0.03]" />
          ))}
        </div>
      </div>
    </main>
  );
}
