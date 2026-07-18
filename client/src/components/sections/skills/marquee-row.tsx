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

interface TechItem {
  name: string;
  color: string;
}

export function MarqueeRow({ items, reverse = false }: { items: TechItem[]; reverse?: boolean }) {
  return (
    <div className="marquee-container overflow-hidden py-2">
      <div
        className={`flex gap-3 ${reverse ? "marquee-track-reverse" : "marquee-track"}`}
        aria-hidden="true"
      >
        {[...items, ...items].map((item, i) => (
          <TechPill key={i} name={item.name} color={item.color} />
        ))}
      </div>
    </div>
  );
}
