/**
 * Single source of truth for year-range period formatting.
 * Shared by experience + education cards (previously duplicated).
 */
export function formatPeriod(startDate: string, endDate: string | null): string {
  const startYear = new Date(startDate).getFullYear();
  const endYear = endDate ? new Date(endDate).getFullYear() : null;

  const start = Number.isNaN(startYear) ? "—" : String(startYear);
  const end = endDate
    ? endYear !== null && !Number.isNaN(endYear)
      ? String(endYear)
      : "—"
    : "Present";

  return `${start} – ${end}`;
}
