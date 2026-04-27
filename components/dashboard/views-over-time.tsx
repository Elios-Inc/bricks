"use client";

import { useMemo, useState, type MouseEvent as ReactMouseEvent } from "react";

import {
  dailyViews,
  dailyViewsPrior,
  platformMeta,
  platformOrder,
  sliceDaily,
  type PlatformKey,
} from "@/lib/dashboard/data";
import { useTimeframe } from "./timeframe-context";

const W = 1200;
const H = 360;
const PAD = { top: 24, right: 28, bottom: 34, left: 64 };
const CW = W - PAD.left - PAD.right;
const CH = H - PAD.top - PAD.bottom;

type HoverState = {
  index: number;
  clientX: number;
  clientY: number;
  containerWidth: number;
};

export function ViewsOverTime() {
  const { timeframe } = useTimeframe();
  const [hover, setHover] = useState<HoverState | null>(null);

  const { stacks, prior, yMax, days, targetDaily } = useMemo(() => {
    const current = sliceDaily(dailyViews, timeframe);
    const priorRaw = sliceDaily(dailyViewsPrior, timeframe);
    const priorTotals = priorRaw.map((d) =>
      d.tiktok + d.youtube + d.instagram + d.facebook
    );
    const s = current.map((d) => {
      let y = 0;
      const parts = platformOrder.map((key) => {
        const v = d[key];
        const entry = { key, y0: y, y1: y + v };
        y += v;
        return entry;
      });
      return { date: d.label, total: y, parts };
    });
    const maxTotal = Math.max(
      ...s.map((x) => x.total),
      ...priorTotals,
    );
    const rounded = Math.ceil(maxTotal / 250_000) * 250_000;
    return {
      stacks: s,
      prior: priorTotals,
      yMax: rounded,
      days: current,
      targetDaily: 3_333_333, // 100M/mo pace
    };
  }, [timeframe]);

  const xFor = (i: number) =>
    PAD.left + (days.length === 1 ? CW / 2 : (i / (days.length - 1)) * CW);
  const yFor = (v: number) => PAD.top + CH - (v / yMax) * CH;

  const areaForKey = (key: (typeof platformOrder)[number]) => {
    const top = stacks
      .map((s, i) => {
        const p = s.parts.find((p) => p.key === key);
        if (!p) return "";
        return `${xFor(i)},${yFor(p.y1)}`;
      })
      .filter(Boolean)
      .join(" ");
    const bottom = stacks
      .map((s, i) => {
        const p = s.parts.find((p) => p.key === key);
        if (!p) return "";
        return `${xFor(i)},${yFor(p.y0)}`;
      })
      .filter(Boolean)
      .reverse()
      .join(" ");
    return `M${top} L${bottom} Z`;
  };

  const totalLine = stacks
    .map((s, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(s.total)}`)
    .join(" ");

  const priorLine = prior
    .map((v, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(v)}`)
    .join(" ");

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((r) => ({
    value: r * yMax,
    y: yFor(r * yMax),
  }));

  const maxLabels = 8;
  const step = Math.max(1, Math.floor(days.length / maxLabels));

  const tfLabel =
    { "7D": "Last 7 days", "30D": "Last 30 days", "90D": "Last 90 days", YTD: "Year to date", ALL: "All-time" }[timeframe];
  const priorLabel =
    timeframe === "ALL"
      ? "Pre-BRICKS baseline"
      : `Prior ${timeframe === "YTD" ? "year" : timeframe.toLowerCase()}`;

  const handleMouseMove = (event: ReactMouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || days.length === 0) return;
    const relativeX = event.clientX - rect.left;
    // Map client x to viewBox x
    const vbX = (relativeX / rect.width) * W;
    let index: number;
    if (days.length === 1) {
      index = 0;
    } else {
      const ratio = (vbX - PAD.left) / CW;
      const clamped = Math.min(1, Math.max(0, ratio));
      index = Math.round(clamped * (days.length - 1));
    }
    setHover({
      index,
      clientX: event.clientX,
      clientY: event.clientY,
      containerWidth: rect.width,
    });
  };

  const handleMouseLeave = () => setHover(null);

  const hoveredDay = hover ? days[hover.index] : null;
  const hoveredStack = hover ? stacks[hover.index] : null;
  const hoveredPrior = hover ? prior[hover.index] : null;
  const crosshairX = hover ? xFor(hover.index) : 0;

  const formatValue = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return `${n}`;
  };

  // Tooltip overlay positioning in container-relative pixels
  let tooltipLeft = 0;
  let tooltipFlip = false;
  if (hover) {
    const svgLeftInContainer = 16; // p-4 = 16px
    // convert hovered index back to container pixel space
    const pxPerViewBox = hover.containerWidth / W;
    tooltipLeft = svgLeftInContainer + crosshairX * pxPerViewBox;
    const tooltipWidth = 220;
    const gap = 14;
    // Container width for overflow check (approx: svg region + 2*16 padding)
    const containerApproxWidth = hover.containerWidth + 32;
    if (tooltipLeft + gap + tooltipWidth > containerApproxWidth - 8) {
      tooltipFlip = true;
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/5 bg-surface-overlay">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 px-6 py-4">
        <p className="font-mono text-[10px] tracking-[0.22em] text-white/45 uppercase">
          Daily Views · {tfLabel}
        </p>
        <ul role="list" className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] text-white/65">
          {platformOrder.map((k) => (
            <li key={k} className="flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-[3px]"
                style={{ background: platformMeta[k].color }}
              />
              <span>{platformMeta[k].label}</span>
            </li>
          ))}
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-0 w-4 border-t border-dashed border-white/70" />
            <span>Current total</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-0 w-4 border-t border-dashed border-white/30" />
            <span>{priorLabel}</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-0 w-4 border-t border-dashed border-glow" />
            <span>100M/mo pace</span>
          </li>
        </ul>
      </div>

      <div className="relative p-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {platformOrder.map((k) => (
              <linearGradient
                key={k}
                id={`grad-${k}`}
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={platformMeta[k].color}
                  stopOpacity="0.88"
                />
                <stop
                  offset="100%"
                  stopColor={platformMeta[k].color}
                  stopOpacity="0.35"
                />
              </linearGradient>
            ))}
          </defs>

          {yTicks.map((t) => (
            <g key={t.value}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={t.y}
                y2={t.y}
                stroke="white"
                strokeOpacity="0.06"
              />
              <text
                x={PAD.left - 10}
                y={t.y + 4}
                textAnchor="end"
                className="fill-white/40 font-mono text-[10px]"
              >
                {(t.value / 1_000_000).toFixed(1)}M
              </text>
            </g>
          ))}

          {platformOrder.map((k) => (
            <path key={k} d={areaForKey(k)} fill={`url(#grad-${k})`} />
          ))}

          {/* Prior-period overlay (always-on) */}
          <path
            d={priorLine}
            fill="none"
            stroke="white"
            strokeOpacity="0.35"
            strokeWidth="1.25"
            strokeDasharray="3 5"
          />

          {/* Current total */}
          <path
            d={totalLine}
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            strokeOpacity="0.9"
          />

          {/* Target */}
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={yFor(targetDaily)}
            y2={yFor(targetDaily)}
            stroke="var(--glow)"
            strokeWidth="1.25"
            strokeDasharray="6 6"
          />
          <text
            x={W - PAD.right - 4}
            y={yFor(targetDaily) - 6}
            textAnchor="end"
            className="fill-glow font-mono text-[10px]"
          >
            100M/mo pace · 3.33M/day
          </text>

          {days.map((d, i) =>
            i % step === 0 || i === days.length - 1 ? (
              <text
                key={`${d.date}-${i}`}
                x={xFor(i)}
                y={H - 10}
                textAnchor="middle"
                className="fill-white/45 font-mono text-[10px]"
              >
                {d.label}
              </text>
            ) : null
          )}

          {/* Hover crosshair + point markers */}
          {hover && hoveredStack ? (
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
              {hoveredStack.parts.map((p) => (
                <circle
                  key={p.key}
                  cx={crosshairX}
                  cy={yFor(p.y1)}
                  r={4}
                  fill={platformMeta[p.key].color}
                  stroke="var(--surface-overlay)"
                  strokeWidth={2}
                />
              ))}
            </g>
          ) : null}
        </svg>

        {hover && hoveredDay && hoveredStack ? (
          <div
            className="pointer-events-none absolute z-10 w-[220px] rounded-lg border border-white/10 bg-surface-tooltip/95 p-3 shadow-lg backdrop-blur"
            style={{
              left: tooltipFlip ? undefined : tooltipLeft + 14,
              right: tooltipFlip
                ? Math.max(
                    8,
                    (hover.containerWidth + 32) - tooltipLeft + 14,
                  )
                : undefined,
              top: 16,
            }}
          >
            <p className="mb-2 font-mono text-[10px] tracking-[0.18em] text-white/45 uppercase">
              {hoveredDay.label}
            </p>
            <ul className="space-y-1.5">
              {platformOrder.map((k) => {
                const value = hoveredDay[k as PlatformKey];
                return (
                  <li
                    key={k}
                    className="flex items-center justify-between gap-3 text-[11px]"
                  >
                    <span className="flex items-center gap-2 text-white/70">
                      <span
                        className="size-2 rounded-full"
                        style={{ background: platformMeta[k].color }}
                      />
                      {platformMeta[k].label}
                    </span>
                    <span className="font-mono tabular-nums text-white">
                      {formatValue(value)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 text-[11px]">
              <span className="text-white/70">Total</span>
              <span className="font-mono tabular-nums text-white">
                {formatValue(hoveredStack.total)}
              </span>
            </div>
            {hoveredPrior !== null && hoveredPrior !== undefined ? (
              <div className="mt-1 flex items-center justify-between text-[10px] text-white/45">
                <span>Prior</span>
                <span className="font-mono tabular-nums">
                  {formatValue(hoveredPrior)}
                </span>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
