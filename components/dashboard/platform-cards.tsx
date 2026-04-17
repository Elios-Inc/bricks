"use client";

import {
  platformCards,
  platformMeta,
  timeframeViewsLabel,
} from "@/lib/dashboard/data";
import { PlatformIcon } from "./platform-icon";
import { useTimeframe } from "./timeframe-context";

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
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
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
  const { timeframe } = useTimeframe();
  const viewsLabel = timeframeViewsLabel(timeframe);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {platformCards.map((p) => {
        const meta = platformMeta[p.key];
        return (
          <div
            key={p.key}
            className="group overflow-hidden rounded-xl border border-white/5 bg-[#141414] transition hover:border-white/15"
          >
            <div
              className="h-1 w-full"
              style={{
                background:
                  p.key === "instagram"
                    ? "linear-gradient(90deg,#F58529,#DD2A7B,#8134AF)"
                    : meta.color,
              }}
            />
            <div className="p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <PlatformIcon platform={p.key} className="size-5" />
                  <span className="text-sm font-semibold text-white">
                    {meta.label}
                  </span>
                </div>
                <div className="w-32">
                  <Sparkline data={p.spark} color={meta.color} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 border-b border-white/5 pb-5">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                    {viewsLabel}
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
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                    Engagement
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-[#00C853] tabular-nums">
                    {p.engagementRate}
                  </p>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                    CPM Range
                  </dt>
                  <dd className="mt-1 font-mono text-sm text-white tabular-nums">
                    {p.cpmRange}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                    Top Member
                  </dt>
                  <dd className="mt-1 text-sm text-white">
                    {p.topMember}
                    <span className="ml-1 font-mono text-xs text-white/50">
                      · {p.topMemberViews}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        );
      })}
    </div>
  );
}
