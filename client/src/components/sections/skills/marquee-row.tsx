const COLORS = [
  "#61dafb",
  "#3178c6",
  "#68a063",
  "#38bdf8",
  "#e535ab",
  "#2496ed",
  "#f05032",
  "#ff9900",
  "#bb4bf8",
  "#88ce02",
  "#dc382d",
  "#5a67d8",
  "#47a248",
  "#336791",
  "#3776ab",
];

function hashColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function TechPill({ name, color }: { name: string; color: string }) {
  return (
    <span className="inline-flex cursor-default items-center gap-2 whitespace-nowrap rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:text-white">
      <span
        className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
      />
      {name}
    </span>
  );
}

export function MarqueeRow({ items }: { items: string[] }) {
  return (
    <div className="marquee-container overflow-hidden py-2">
      <div className="marquee-track flex gap-3" aria-hidden="true">
        {[...items, ...items].map((name, i) => (
          <TechPill key={i} name={name} color={hashColor(name)} />
        ))}
      </div>
    </div>
  );
}
