export default function ProjectDetailLoading() {
  return (
    <div className="min-h-screen bg-[#050810] px-6 pt-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 h-5 w-32 animate-pulse rounded-lg bg-white/5" />
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div className="h-4 w-20 animate-pulse rounded bg-white/5" />
            <div className="h-12 w-3/4 animate-pulse rounded-lg bg-white/5" />
            <div className="h-6 w-full animate-pulse rounded bg-white/5" />
            <div className="h-10 w-40 animate-pulse rounded-full bg-white/5" />
          </div>
          <div className="h-96 animate-pulse rounded-2xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}
