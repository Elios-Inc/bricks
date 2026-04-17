import { platformCards, platformMeta } from "@/lib/dashboard/data";
import { PlatformIcon } from "./platform-icon";

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 140;
  const h = 36;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const area = `M0,${h} L${points
    .split(" ")
    .map((p) => p)
    .join(" L")} L${w},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-full">
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${color})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PlatformCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {platformCards.map((p) => {
        const meta = platformMeta[p.key];
        return (
          <div
            key={p.key}
            className="overflow-hidden rounded-lg border border-white/5 bg-[#1A1A1A]"
          >
            <div className="h-1 w-full" style={{ background: meta.color }} />
            <div className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <PlatformIcon platform={p.key} className="size-5" />
                  <span className="text-sm font-semibold text-white">
                    {meta.label}
                  </span>
                </div>
                <div className="w-28">
                  <Sparkline data={p.spark} color={meta.color} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 border-b border-white/5 pb-5">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                    Total Views
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white tabular-nums">
                    {p.views}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                    Followers
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white tabular-nums">
                    {p.followers}
                  </p>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                    {p.qualityLabel}
                  </dt>
                  <dd className="mt-1 font-mono text-sm text-white tabular-nums">
                    {p.qualityValue}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                    CPM Range
                  </dt>
                  <dd className="mt-1 font-mono text-sm text-white tabular-nums">
                    {p.cpmRange}
                  </dd>
                </div>
                <div className="col-span-2 rounded-md border border-[#00C853]/30 bg-[#00C853]/5 p-3">
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-[#00C853]/80 uppercase">
                    Est. Value (30D)
                  </dt>
                  <dd className="mt-1 text-xl font-semibold text-[#00C853] tabular-nums">
                    {p.estValue}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                    Top Member
                  </dt>
                  <dd className="mt-1 text-sm text-white">{p.topMember}</dd>
                </div>
              </dl>
            </div>
          </div>
        );
      })}
    </div>
  );
}
