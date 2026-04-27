"use client";

import { useMemo, useState, type MouseEvent as ReactMouseEvent } from "react";

type DailyMetric = {
  date: string;
  totalViews: number;
};

type Props = { dailyMetrics: DailyMetric[] };

type Mode = "daily" | "cumulative";

type HoverState = {
  index: number;
  containerWidth: number;
};

const W = 1200;
const H = 360;
const PAD = { top: 24, right: 28, bottom: 34, left: 64 };
const CW = W - PAD.left - PAD.right;
const CH = H - PAD.top - PAD.bottom;

export function ClippingViewsChart({ dailyMetrics }: Props) {
  const [mode, setMode] = useState<Mode>("daily");
  const [hover, setHover] = useState<HoverState | null>(null);

  const chart = useMemo(() => {
    let runningTotal = 0;
    const points = dailyMetrics.map((metric) => {
      runningTotal += metric.totalViews;
      return {
        date: metric.date,
        value: mode === "daily" ? metric.totalViews : runningTotal,
      };
    });
    const maxValue = Math.max(...points.map((point) => point.value), 0);
    const yMax = maxValue === 0 ? 1 : Math.ceil(maxValue / 100_000) * 100_000;

    return { points, yMax };
  }, [dailyMetrics, mode]);

  const xFor = (i: number) =>
    PAD.left +
    (chart.points.length === 1 ? CW / 2 : (i / (chart.points.length - 1)) * CW);
  const yFor = (value: number) => PAD.top + CH - (value / chart.yMax) * CH;

  const linePath = chart.points
    .map((point, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(point.value)}`)
    .join(" ");

  const areaPath = chart.points.length
    ? `${linePath} L${xFor(chart.points.length - 1)},${PAD.top + CH} L${xFor(0)},${PAD.top + CH} Z`
    : "";

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    value: ratio * chart.yMax,
    y: yFor(ratio * chart.yMax),
  }));

  const maxLabels = 8;
  const step = Math.max(1, Math.ceil(chart.points.length / maxLabels));

  const handleMouseMove = (event: ReactMouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || chart.points.length === 0) return;

    const relativeX = event.clientX - rect.left;
    const vbX = (relativeX / rect.width) * W;
    const ratio = (vbX - PAD.left) / CW;
    const clamped = Math.min(1, Math.max(0, ratio));
    const index =
      chart.points.length === 1
        ? 0
        : Math.round(clamped * (chart.points.length - 1));

    setHover({ index, containerWidth: rect.width });
  };

  const hoveredPoint = hover ? chart.points[hover.index] : null;
  const crosshairX = hover ? xFor(hover.index) : 0;

  let tooltipLeft = 0;
  let tooltipFlip = false;
  if (hover) {
    const svgLeftInContainer = 16;
    const pxPerViewBox = hover.containerWidth / W;
    tooltipLeft = svgLeftInContainer + crosshairX * pxPerViewBox;
    tooltipFlip = tooltipLeft + 194 > hover.containerWidth + 32;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/5 bg-surface-overlay">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 px-6 py-4">
        <p className="font-mono text-[10px] tracking-[0.22em] text-white/45 uppercase">
          Views Over Time
        </p>
        <div
          role="tablist"
          aria-label="Views display mode"
          className="flex items-center gap-0.5 rounded-md border border-white/10 bg-surface-base p-0.5"
        >
          {(
            [
              { key: "daily", label: "Daily" },
              { key: "cumulative", label: "Cumulative" },
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

      <div className="relative p-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="clipping-views-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--glow)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#00C853" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => (
            <g key={tick.value}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={tick.y}
                y2={tick.y}
                stroke="white"
                strokeOpacity="0.06"
              />
              <text
                x={PAD.left - 10}
                y={tick.y + 4}
                textAnchor="end"
                className="fill-white/40 font-mono text-[10px]"
              >
                {formatNum(tick.value)}
              </text>
            </g>
          ))}

          {areaPath ? <path d={areaPath} fill="url(#clipping-views-area)" /> : null}
          {linePath ? (
            <path
              d={linePath}
              fill="none"
              stroke="var(--glow)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {chart.points.map((point, i) => (
            <circle
              key={`dot-${i}`}
              cx={xFor(i)}
              cy={yFor(point.value)}
              r={chart.points.length <= 7 ? 4 : 2.5}
              fill="var(--glow)"
              stroke="var(--surface-overlay)"
              strokeWidth={1.5}
            />
          ))}

          {chart.points.map((point, i) =>
            i % step === 0 || i === chart.points.length - 1 ? (
              <text
                key={`${point.date}-${i}`}
                x={xFor(i)}
                y={H - 10}
                textAnchor="middle"
                className="fill-white/45 font-mono text-[10px]"
              >
                {formatDate(point.date)}
              </text>
            ) : null
          )}

          {hover && hoveredPoint ? (
            <g pointerEvents="none">
              <line
                x1={crosshairX}
                x2={crosshairX}
                y1={PAD.top}
                y2={PAD.top + CH}
                stroke="white"
                strokeOpacity={0.25}
                strokeWidth={1}
              />
              <circle
                cx={crosshairX}
                cy={yFor(hoveredPoint.value)}
                r={4}
                fill="var(--glow)"
                stroke="var(--surface-overlay)"
                strokeWidth={2}
              />
            </g>
          ) : null}
        </svg>

        {hover && hoveredPoint ? (
          <div
            className="pointer-events-none absolute z-10 w-[180px] rounded-lg border border-white/10 bg-surface-tooltip/95 p-3 shadow-lg backdrop-blur"
            style={{
              left: tooltipFlip ? undefined : tooltipLeft + 14,
              right: tooltipFlip
                ? Math.max(8, hover.containerWidth + 32 - tooltipLeft + 14)
                : undefined,
              top: 16,
            }}
          >
            <p className="mb-2 font-mono text-[10px] tracking-[0.18em] text-white/45 uppercase">
              {formatLongDate(hoveredPoint.date)}
            </p>
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <span className="text-white/70">Views</span>
              <span className="font-mono tabular-nums text-white">
                {formatNum(hoveredPoint.value)}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return Math.round(n).toLocaleString();
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(
    new Date(`${date}T00:00:00`)
  );
}

function formatLongDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}
