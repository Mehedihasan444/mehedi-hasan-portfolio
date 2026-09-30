// NOTE: Offline sample snapshot — deterministic sin-based placeholder, not live
// GitHub contribution data. Labeled as such in the UI until API wiring lands.
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

  // Deterministic total for the screen-reader summary (mirrors the grid below).
  let total = 0;
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      total += Math.round(seed(w, d) * 8);
    }
  }

  return (
    <div className="overflow-x-auto pb-2">
      <p className="mb-3 text-xs text-white/40">
        Sample snapshot — offline placeholder, not live GitHub data
      </p>
      {/* Keyboard-/screen-reader-accessible text summary of the decorative grid. */}
      <p className="sr-only">
        Sample contribution activity: approximately {total} contributions over the last 6 months (24
        weeks). This is placeholder data, not live GitHub activity.
      </p>
      <div className="flex min-w-max gap-1" aria-hidden="true">
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
