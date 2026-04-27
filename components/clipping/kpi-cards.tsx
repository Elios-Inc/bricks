type ClippingKpis = {
  totalViews: number;
  totalEngagements: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalBookmarks: number;
  daysCount: number;
};

type Props = { kpis: ClippingKpis };

const cards = [
  { key: "totalViews", label: "Views" },
  { key: "totalEngagements", label: "Engagement" },
  { key: "totalLikes", label: "Likes" },
  { key: "totalComments", label: "Comments" },
  { key: "totalShares", label: "Shares" },
  { key: "totalBookmarks", label: "Saves" },
] as const;

export function ClippingKpiCards({ kpis }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.key}
          className="group relative flex flex-col justify-between gap-6 rounded-xl border border-white/5 bg-surface-overlay p-5 transition hover:border-white/15 hover:bg-surface-hover"
        >
          <p className="font-mono text-[10px] leading-snug tracking-[0.15em] text-white/45 uppercase">
            {card.label}
          </p>
          <p className="text-[26px] leading-none font-semibold tracking-tight text-white tabular-nums">
            {formatNum(kpis[card.key])}
          </p>
        </div>
      ))}
    </div>
  );
}

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}K`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}
