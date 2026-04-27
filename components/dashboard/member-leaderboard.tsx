"use client";

import { useMemo, useState } from "react";

import { members, timeframeViewsLabel } from "@/lib/dashboard/data";
import { useDensity } from "./density-context";
import { useTimeframe } from "./timeframe-context";

type Mode = "views" | "followers";

function formatCompact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toString();
}

function medal(rank: number) {
  if (rank === 1) return "var(--medal-gold)";
  if (rank === 2) return "var(--medal-silver)";
  if (rank === 3) return "var(--medal-bronze)";
  return null;
}

function engColor(eng: number) {
  if (eng > 4) return "text-glow";
  if (eng >= 2) return "text-warning";
  return "text-danger";
}

function tagClass(tag: string) {
  const map: Record<string, string> = {
    fitness: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    lifestyle: "bg-pink-500/10 text-pink-300 border-pink-500/20",
    entrepreneurship: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    automotive: "bg-red-500/10 text-red-300 border-red-500/20",
    tech: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    content: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    wellness: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  };
  return map[tag] ?? "bg-white/5 text-white/70 border-white/10";
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul role="list" className="flex flex-wrap gap-1">
      {tags.map((t) => (
        <li
          key={t}
          className={`rounded-full border px-1.5 py-0.5 text-[10px] tracking-wide ${tagClass(t)}`}
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-white/15 to-white/5 font-mono text-[11px] font-semibold text-white/85"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
}

export function MemberLeaderboard() {
  const [mode, setMode] = useState<Mode>("views");
  const { timeframe } = useTimeframe();
  const { density } = useDensity();
  const viewsLabel = timeframeViewsLabel(timeframe);
  const compact = density === "compact";
  const cellPad = compact ? "px-3 py-1.5" : "px-4 py-3";
  const avatarSize = compact ? 24 : 32;

  const ranked = useMemo(() => {
    const sorted = [...members].sort((a, b) =>
      mode === "views"
        ? b.views30d - a.views30d
        : b.followers - a.followers,
    );
    return sorted.map((m, i) => ({ ...m, rank: i + 1 }));
  }, [mode]);

  return (
    <div className="overflow-hidden rounded-xl border border-white/5 bg-surface-overlay">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-5 py-3.5">
        <p className="font-mono text-[10px] tracking-[0.22em] text-white/45 uppercase">
          14 members · Ranked by {mode === "views" ? viewsLabel : "Followers"}
        </p>
        <div
          role="tablist"
          aria-label="Rank metric"
          className="flex items-center gap-0.5 rounded-md border border-white/10 bg-surface-base p-0.5"
        >
          {(
            [
              { key: "views", label: "Views" },
              { key: "followers", label: "Followers" },
            ] as const
          ).map((opt) => {
            const active = opt.key === mode;
            return (
              <button
                key={opt.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMode(opt.key)}
                className={[
                  "rounded-[4px] px-3 py-1 font-mono text-[10px] tracking-wider uppercase transition",
                  active
                    ? "bg-white text-surface-base"
                    : "text-white/60 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] tracking-wider text-white/40 uppercase">
              <th className={`${cellPad} font-normal whitespace-nowrap`}>#</th>
              <th className={`${cellPad} font-normal whitespace-nowrap`}>
                Member
              </th>
              <th className={`${cellPad} text-right font-normal whitespace-nowrap`}>
                {mode === "views" ? viewsLabel : "Total Followers"}
              </th>
              <th className={`${cellPad} text-right font-normal whitespace-nowrap`}>
                Eng%
              </th>
              <th className={`${cellPad} text-right font-normal whitespace-nowrap`}>
                Growth
              </th>
              <th className={`${cellPad} text-right font-normal whitespace-nowrap`}>
                Top Post
              </th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((m) => {
              const medalColor = medal(m.rank);
              const big = mode === "views" ? m.views30d : m.followers;
              const growth =
                mode === "views" ? m.growth30d : m.followerGrowth30d;
              return (
                <tr
                  key={m.id}
                  className="border-t border-white/5 transition hover:bg-white/5"
                >
                  <td className={cellPad}>
                    {medalColor ? (
                      <span
                        className="flex size-6 items-center justify-center rounded-full font-mono text-[10px] font-semibold text-surface-base"
                        style={{ background: medalColor }}
                      >
                        {m.rank}
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-white/50 tabular-nums">
                        {m.rank}
                      </span>
                    )}
                  </td>
                  <td className={cellPad}>
                    <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
                      <Avatar name={m.name} size={avatarSize} />
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="text-sm font-medium text-white">
                          {m.name}
                        </span>
                        {!compact && <Tags tags={m.tags} />}
                      </div>
                    </div>
                  </td>
                  <td className={`${cellPad} text-right font-mono text-sm font-semibold text-white tabular-nums`}>
                    {formatCompact(big)}
                  </td>
                  <td
                    className={`${cellPad} text-right font-mono text-xs font-semibold tabular-nums ${engColor(m.engagement)}`}
                  >
                    {m.engagement.toFixed(1)}%
                  </td>
                  <td className={`${cellPad} text-right font-mono text-xs text-glow tabular-nums`}>
                    +{growth.toLocaleString()}
                  </td>
                  <td className={`${cellPad} text-right font-mono text-xs text-white/70 tabular-nums`}>
                    {formatCompact(m.topPostViews)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
