function seed(w: number, d: number) {
  const n = Math.sin(w * 37 + d * 13) * 43758.5453;
  return Math.abs(n - Math.floor(n));
}

function intensity(v: number) {
  if (v < 0.4) return "bg-white/[0.04]";
  if (v < 0.6) return "bg-emerald/20";
  if (v < 0.75) return "bg-emerald/40";
  if (v < 0.88) return "bg-emerald/65";
  return "bg-emerald";
}

export function ContributionHeatmap() {
  const weeks = 24;
  const days = 7;

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max gap-1" aria-label="GitHub contribution heatmap" role="img">
        {Array.from({ length: weeks }).map((_, w) => (
          <div key={w} className="flex flex-col gap-1">
            {Array.from({ length: days }).map((_, d) => {
              const v = seed(w, d);
              return (
                <div
                  key={d}
                  title={`${Math.round(v * 8)} contributions`}
                  className={`h-3 w-3 rounded-sm ${intensity(v)} cursor-default transition-all duration-200 hover:scale-125`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
