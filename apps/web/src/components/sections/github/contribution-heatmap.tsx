// Real repository activity, derived from the GitHub REST API.
//
// Source: GET /users/Mehedihasan444/repos?per_page=100 — the most recent
// `pushed_at` per repository, bucketed by month. GitHub's REST API does not
// expose a per-day contribution graph, so this counts repositories last pushed
// in each month (not individual commits) and is an approximation of activity
// rather than a replacement for the real contributions calendar.
//
// Replaces an earlier sin-based placeholder that rendered invented squares.
export type ActivityMonth = { month: string; repos: number };

// Generated 2026-09-30 from the live profile snapshot. Months with no pushes
// are omitted rather than zero-filled so the bar chart stays proportional.
export const activityByMonth: ActivityMonth[] = [
  { month: "Sep 2022", repos: 1 },
  { month: "Nov 2022", repos: 1 },
  { month: "Jul 2023", repos: 9 },
  { month: "Aug 2023", repos: 6 },
  { month: "Sep 2023", repos: 3 },
  { month: "Oct 2023", repos: 2 },
  { month: "Dec 2023", repos: 1 },
  { month: "Jan 2024", repos: 10 },
  { month: "Feb 2024", repos: 4 },
  { month: "Mar 2024", repos: 2 },
  { month: "Apr 2024", repos: 1 },
  { month: "May 2024", repos: 4 },
  { month: "Jul 2024", repos: 2 },
  { month: "Aug 2024", repos: 1 },
  { month: "Oct 2024", repos: 1 },
  { month: "Nov 2024", repos: 4 },
  { month: "Dec 2024", repos: 1 },
  { month: "Jan 2025", repos: 4 },
  { month: "Feb 2025", repos: 3 },
  { month: "Aug 2025", repos: 2 },
  { month: "Oct 2025", repos: 4 },
  { month: "Nov 2025", repos: 4 },
  { month: "Dec 2025", repos: 1 },
  { month: "Jan 2026", repos: 1 },
  { month: "May 2026", repos: 1 },
  { month: "Sep 2026", repos: 7 },
];

function barColor(v: number, max: number) {
  const r = v / max;
  if (r < 0.35) return "bg-emerald/25";
  if (r < 0.6) return "bg-emerald/45";
  if (r < 0.8) return "bg-emerald/70";
  return "bg-emerald";
}

export function ContributionHeatmap() {
  const max = Math.max(...activityByMonth.map((m) => m.repos));
  const total = activityByMonth.reduce((sum, m) => sum + m.repos, 0);
  const peak = activityByMonth.reduce((a, b) => (b.repos > a.repos ? b : a));
  const first = activityByMonth[0]?.month ?? "";
  const last = activityByMonth[activityByMonth.length - 1]?.month ?? "";

  return (
    <div className="overflow-x-auto pb-2">
      <p className="mb-3 text-xs text-white/40">
        Repositories last pushed, {first} – {last}
      </p>
      {/* Keyboard-/screen-reader-accessible summary of the decorative chart. */}
      <p className="sr-only">
        Public repository activity from {first} to {last}: {total} repositories in total, peaking at{" "}
        {peak.repos} repositories last pushed in {peak.month}.
      </p>
      <div className="flex min-w-max items-end gap-1" aria-hidden="true">
        {activityByMonth.map((m) => (
          <div key={m.month} className="flex flex-col items-center gap-1">
            <div
              title={`${m.month}: ${m.repos} repo${m.repos === 1 ? "" : "s"} last pushed`}
              className={`w-2.5 rounded-sm transition-all duration-200 hover:scale-125 ${barColor(
                m.repos,
                max,
              )}`}
              style={{ height: `${Math.max(6, (m.repos / max) * 72)}px` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
