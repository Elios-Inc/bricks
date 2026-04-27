"use client";

import { useMemo, useState } from "react";

type DailyMetric = {
  date: string;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalBookmarks: number;
  totalEngagements: number;
  adsUploadCount: number;
};

type Props = { dailyMetrics: DailyMetric[] };

type Mode = "averages" | "byDay";

type MetricTotals = {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
};

export function ClippingMetricsBreakdown({ dailyMetrics }: Props) {
  const [mode, setMode] = useState<Mode>("averages");

  const totals = useMemo(
    () =>
      dailyMetrics.reduce<MetricTotals>(
        (acc, metric) => ({
          views: acc.views + metric.totalViews,
          likes: acc.likes + metric.totalLikes,
          comments: acc.comments + metric.totalComments,
          shares: acc.shares + metric.totalShares,
          bookmarks: acc.bookmarks + metric.totalBookmarks,
        }),
        { views: 0, likes: 0, comments: 0, shares: 0, bookmarks: 0 }
      ),
    [dailyMetrics]
  );

  const daysCount = dailyMetrics.length;
  const weekCount = Math.floor(daysCount / 7);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 border-b border-white/5 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[0.28em] text-white/40 uppercase">
            Breakdown
          </p>
          <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-white">
            Metrics Breakdown
          </h2>
        </div>
        <div
          role="tablist"
          aria-label="Metrics breakdown mode"
          className="flex w-fit items-center gap-0.5 rounded-md border border-white/10 bg-surface-base p-0.5"
        >
          {(
            [
              { key: "averages", label: "Averages" },
              { key: "byDay", label: "By Day" },
            ] as const
          ).map((option) => {
            const active = option.key === mode;
            return (
              <button
                key={option.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMode(option.key)}
                className={[
                  "rounded-[4px] px-3 py-1 font-mono text-[10px] tracking-wider uppercase transition",
                  active
                    ? "bg-white text-surface-base"
                    : "text-white/60 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/5 bg-surface-overlay">
        <div className="overflow-x-auto">
          {mode === "averages" ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] tracking-wider text-white/40 uppercase">
                  <th className="px-5 py-3.5 font-normal whitespace-nowrap">
                    Period
                  </th>
                  <th className="px-5 py-3.5 text-right font-normal whitespace-nowrap">
                    Avg Views
                  </th>
                  <th className="px-5 py-3.5 text-right font-normal whitespace-nowrap">
                    Avg Likes
                  </th>
                  <th className="px-5 py-3.5 text-right font-normal whitespace-nowrap">
                    Avg Comments
                  </th>
                  <th className="px-5 py-3.5 text-right font-normal whitespace-nowrap">
                    Avg Shares
                  </th>
                  <th className="px-5 py-3.5 text-right font-normal whitespace-nowrap">
                    Avg Saves
                  </th>
                </tr>
              </thead>
              <tbody>
                <AverageRow label="Daily Average" totals={totals} divisor={daysCount} />
                {weekCount >= 1 ? (
                  <AverageRow
                    label="Weekly Average"
                    totals={totals}
                    divisor={weekCount}
                  />
                ) : null}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] tracking-wider text-white/40 uppercase">
                  <th className="px-5 py-3.5 font-normal whitespace-nowrap">
                    Date
                  </th>
                  <th className="px-5 py-3.5 text-right font-normal whitespace-nowrap">
                    Videos Uploaded
                  </th>
                  <th className="px-5 py-3.5 text-right font-normal whitespace-nowrap">
                    Total Views
                  </th>
                  <th className="px-5 py-3.5 text-right font-normal whitespace-nowrap">
                    Total Likes
                  </th>
                  <th className="px-5 py-3.5 text-right font-normal whitespace-nowrap">
                    Total Comments
                  </th>
                  <th className="px-5 py-3.5 text-right font-normal whitespace-nowrap">
                    Total Shares
                  </th>
                </tr>
              </thead>
              <tbody>
                {dailyMetrics.map((metric) => (
                  <tr
                    key={metric.date}
                    className="border-t border-white/5 transition hover:bg-white/5"
                  >
                    <td className="px-5 py-3.5 text-white whitespace-nowrap">
                      {formatDate(metric.date)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-white/70 tabular-nums whitespace-nowrap">
                      {metric.adsUploadCount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-semibold text-white tabular-nums whitespace-nowrap">
                      {formatNum(metric.totalViews)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-white/70 tabular-nums whitespace-nowrap">
                      {formatNum(metric.totalLikes)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-white/70 tabular-nums whitespace-nowrap">
                      {formatNum(metric.totalComments)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-white/70 tabular-nums whitespace-nowrap">
                      {formatNum(metric.totalShares)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}

function AverageRow({
  label,
  totals,
  divisor,
}: {
  label: string;
  totals: MetricTotals;
  divisor: number;
}) {
  const safeDivisor = Math.max(1, divisor);

  return (
    <tr className="border-t border-white/5 transition hover:bg-white/5">
      <td className="px-5 py-3.5 text-white whitespace-nowrap">{label}</td>
      <td className="px-5 py-3.5 text-right font-mono font-semibold text-white tabular-nums whitespace-nowrap">
        {formatNum(totals.views / safeDivisor)}
      </td>
      <td className="px-5 py-3.5 text-right font-mono text-white/70 tabular-nums whitespace-nowrap">
        {formatNum(totals.likes / safeDivisor)}
      </td>
      <td className="px-5 py-3.5 text-right font-mono text-white/70 tabular-nums whitespace-nowrap">
        {formatNum(totals.comments / safeDivisor)}
      </td>
      <td className="px-5 py-3.5 text-right font-mono text-white/70 tabular-nums whitespace-nowrap">
        {formatNum(totals.shares / safeDivisor)}
      </td>
      <td className="px-5 py-3.5 text-right font-mono text-white/70 tabular-nums whitespace-nowrap">
        {formatNum(totals.bookmarks / safeDivisor)}
      </td>
    </tr>
  );
}

function formatNum(n: number) {
  const rounded = Math.round(n);
  if (rounded >= 1_000_000) return `${(rounded / 1_000_000).toFixed(1)}M`;
  if (rounded >= 10_000) return `${(rounded / 1_000).toFixed(1)}K`;
  if (rounded >= 1_000) return `${(rounded / 1_000).toFixed(1)}K`;
  return rounded.toLocaleString();
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}
