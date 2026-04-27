"use client";

import {
  FilmIcon,
  GalleryHorizontalIcon,
  ImageIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react";

import {
  contentTypes,
  timeframePhrase,
  type ContentType,
} from "@/lib/dashboard/data";
import { useTimeframe } from "./timeframe-context";

const iconFor: Record<ContentType["key"], LucideIcon> = {
  static: ImageIcon,
  short: ZapIcon,
  carousel: GalleryHorizontalIcon,
  long: FilmIcon,
};

const accentFor: Record<ContentType["key"], string> = {
  static: "#5BA8FF",
  short: "#00F2EA",
  carousel: "#DD2A7B",
  long: "#FF6A1F",
};

function formatViews(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toString();
}

export function ContentTypePerformance() {
  const { timeframe } = useTimeframe();
  const tfPhrase = timeframePhrase(timeframe);
  const maxViews = Math.max(...contentTypes.map((c) => c.avgViews));
  const totalPieces = contentTypes.reduce((a, c) => a + c.pieces, 0);

  return (
    <div className="overflow-hidden rounded-xl border border-white/5 bg-surface-overlay">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-6 py-4">
        <p className="font-mono text-[10px] tracking-[0.22em] text-white/45 uppercase">
          Format mix · {tfPhrase} · {totalPieces.toLocaleString()} posts
        </p>
        <p className="text-[11px] text-white/50">
          Long-form earns depth, short-form earns reach. Allocation matches.
        </p>
      </div>

      <ul role="list" className="divide-y divide-white/5">
        {contentTypes.map((c) => {
          const Icon = iconFor[c.key];
          const accent = accentFor[c.key];
          const barWidth = Math.max(4, (c.avgViews / maxViews) * 100);
          return (
            <li key={c.key} className="px-6 py-5">
              <div className="grid grid-cols-[200px_1fr_auto] items-center gap-6">
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-9 items-center justify-center rounded-md border"
                    style={{
                      background: `${accent}12`,
                      borderColor: `${accent}40`,
                    }}
                  >
                    <Icon className="size-4" style={{ color: accent }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {c.label}
                    </p>
                    <p className="font-mono text-[11px] text-white/50 tabular-nums">
                      {c.pieces} pieces · {c.share}% mix
                    </p>
                  </div>
                </div>

                <div className="relative h-10">
                  <div className="absolute inset-y-2 left-0 rounded-md bg-white/5" style={{ right: 0 }} />
                  <div
                    className="absolute inset-y-2 left-0 rounded-md"
                    style={{
                      width: `${barWidth}%`,
                      background: `linear-gradient(90deg, ${accent}65, ${accent}22)`,
                      boxShadow: `inset 0 0 0 1px ${accent}40`,
                    }}
                  />
                  <div className="absolute inset-y-0 flex items-center pl-3 font-mono text-xs font-semibold text-white tabular-nums">
                    {formatViews(c.avgViews)}
                    <span className="ml-1 text-[10px] font-normal tracking-wider text-white/50 uppercase">
                      avg views
                    </span>
                  </div>
                </div>

                <div className="min-w-[140px] text-right">
                  <p className="font-mono text-[10px] tracking-wider text-white/40 uppercase">
                    Avg engagement
                  </p>
                  <p className="text-xl font-semibold text-glow tabular-nums">
                    {c.avgEngagement.toFixed(1)}%
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
