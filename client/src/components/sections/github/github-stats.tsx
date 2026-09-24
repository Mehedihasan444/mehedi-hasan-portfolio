// Server Component — no hooks needed.
// NOTE: Offline sample snapshot. The rest of the site reads live data via
// getProjects/getBlogPosts/etc. from the API, but there is no GitHub API
// wiring yet, so these figures are a static placeholder until live data lands.
import { ghStats } from "./constants";

export function GitHubStats() {
  return (
    <div>
      <p className="mb-4 mt-12 text-center text-xs text-white/40">
        Sample snapshot — offline placeholder, not live GitHub data
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {ghStats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="glass group relative rounded-xl p-5 text-center transition-all duration-500 hover:-translate-y-0.5 hover:border-white/20"
          >
            <div className="from-emerald/5 via-teal/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative z-10">
              <Icon className="text-emerald mx-auto mb-2 h-5 w-5" />
              <div className="font-heading text-gradient text-2xl font-bold">{value}</div>
              <div className="text-muted-foreground mt-1 text-xs">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
