"use client";

import { useMemo, useState } from "react";

import {
  collabEdges,
  collabHero,
  collabNodes,
  timeframePhrase,
  timeframeViewsLabel,
  type CollabNode,
} from "@/lib/dashboard/data";
import { useTimeframe } from "./timeframe-context";

const W = 1200;
const H = 520;

function nodeRadius(v: number, minV: number, maxV: number) {
  const t = (v - minV) / (maxV - minV || 1);
  return 22 + t * 36;
}

export function Collaboration() {
  const [hoverNode, setHoverNode] = useState<string | null>(null);
  const { timeframe } = useTimeframe();
  const tfPhrase = timeframePhrase(timeframe);
  const viewsLabel = timeframeViewsLabel(timeframe);

  const maxViews = Math.max(...collabNodes.map((n) => n.views30d));
  const minViews = Math.min(...collabNodes.map((n) => n.views30d));

  const nodeById = useMemo(
    () =>
      Object.fromEntries(collabNodes.map((n) => [n.id, n])) as Record<
        string,
        CollabNode
      >,
    []
  );

  const totalCollabsByNode = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of collabEdges) {
      map[e.from] = (map[e.from] ?? 0) + e.count;
      map[e.to] = (map[e.to] ?? 0) + e.count;
    }
    return map;
  }, []);

  const connectedIds = useMemo(() => {
    if (!hoverNode) return new Set<string>();
    const set = new Set<string>([hoverNode]);
    for (const e of collabEdges) {
      if (e.from === hoverNode) set.add(e.to);
      if (e.to === hoverNode) set.add(e.from);
    }
    return set;
  }, [hoverNode]);

  return (
    <div className="flex flex-col gap-6">
      {/* Hero row */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col justify-between rounded-xl border border-[#00C853]/40 bg-linear-to-br from-[#0E2A18] to-[#101712] p-6 shadow-[0_0_48px_-14px_rgba(0,200,83,0.55)]">
          <p className="font-mono text-[10px] tracking-[0.22em] text-[#00C853]/80 uppercase">
            Collaboration Lift
          </p>
          <p className="mt-3 text-[72px] leading-none font-semibold tracking-tight text-[#00C853] tabular-nums">
            {collabHero.lift}
          </p>
          <p className="mt-2 max-w-sm text-xs text-white/60">
            Collab content outperforms solo content by{" "}
            <span className="font-semibold text-white">69%</span> in average
            views across the network.
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#141414] p-5">
          <p className="font-mono text-[10px] tracking-[0.22em] text-white/45 uppercase">
            Solo Avg Views
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white tabular-nums">
            {collabHero.soloAvg}
          </p>
          <p className="mt-1 text-[11px] text-white/50">
            Per post, no @mention of another member
          </p>
        </div>
        <div className="rounded-xl border border-white/5 bg-[#141414] p-5">
          <p className="font-mono text-[10px] tracking-[0.22em] text-white/45 uppercase">
            Collab Avg Views
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white tabular-nums">
            {collabHero.collabAvg}
          </p>
          <p className="mt-1 text-[11px] text-white/50">
            Per post, cross-referenced to another member
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#141414] p-5">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] tracking-[0.22em] text-white/45 uppercase">
              Collabs per month
            </p>
            <p className="text-2xl font-semibold text-white tabular-nums">
              {collabHero.collabsPerMonth}
            </p>
          </div>
          <Sparkline
            values={collabHero.collabsPerMonthSpark}
            color="#00C853"
          />
          <p className="mt-1 text-[11px] text-white/50">
            12-month trailing, accelerating
          </p>
        </div>
      </div>

      {/* Network graph */}
      <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#141414]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-6 py-4">
          <p className="font-mono text-[10px] tracking-[0.22em] text-white/45 uppercase">
            Collab network · {tfPhrase}
          </p>
          <ul role="list" className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] text-white/65">
            <li className="flex items-center gap-2">
              <span className="block size-3 rounded-full border border-[#00C853] bg-[#00C853]/15" />
              <span>Bubble size = {viewsLabel.toLowerCase()}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block h-[3px] w-6 rounded bg-white/70" />
              <span>Edge thickness = # collabs</span>
            </li>
            <li className="text-white/40">Hover a member for details</li>
          </ul>
        </div>

        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(0,200,83,0.07),transparent_65%)]"
          aria-hidden
        />

        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="relative w-full"
          role="img"
          aria-label="Member collaboration network"
        >
          {collabEdges.map((e, i) => {
            const a = nodeById[e.from];
            const b = nodeById[e.to];
            if (!a || !b) return null;
            const isFocused =
              !hoverNode || hoverNode === e.from || hoverNode === e.to;
            return (
              <line
                key={i}
                x1={a.x * W}
                y1={a.y * H}
                x2={b.x * W}
                y2={b.y * H}
                stroke={isFocused ? "#00C853" : "#ffffff"}
                strokeOpacity={isFocused ? 0.25 + (e.count / 5) * 0.35 : 0.05}
                strokeWidth={1 + e.count * 0.9}
                strokeLinecap="round"
              />
            );
          })}

          {collabNodes.map((n) => {
            const r = nodeRadius(n.views30d, minViews, maxViews);
            const cx = n.x * W;
            const cy = n.y * H;
            const isActive = hoverNode === n.id;
            const isDim = hoverNode != null && !connectedIds.has(n.id);
            return (
              <g
                key={n.id}
                onMouseEnter={() => setHoverNode(n.id)}
                onMouseLeave={() => setHoverNode(null)}
                opacity={isDim ? 0.25 : 1}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={r + 5}
                  fill="#00C853"
                  opacity={isActive ? 0.22 : 0.08}
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="#141414"
                  stroke={isActive ? "#00E676" : "#00C853"}
                  strokeWidth={isActive ? 2.25 : 1.5}
                />
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  className="pointer-events-none fill-white font-mono text-[12px] font-semibold"
                >
                  {n.initials}
                </text>
                <text
                  x={cx}
                  y={cy + r + 16}
                  textAnchor="middle"
                  className="pointer-events-none fill-white/80 text-[11px] font-medium"
                >
                  {n.lastName}
                </text>
                <text
                  x={cx}
                  y={cy + r + 30}
                  textAnchor="middle"
                  className="pointer-events-none fill-white/45 font-mono text-[10px] tabular-nums"
                >
                  {n.views30d.toFixed(1)}M · {totalCollabsByNode[n.id] ?? 0}{" "}
                  collabs
                </text>
              </g>
            );
          })}
        </svg>

        {hoverNode && (
          <HoverCard
            node={nodeById[hoverNode]}
            totalCollabs={totalCollabsByNode[hoverNode] ?? 0}
            viewsLabel={viewsLabel}
          />
        )}
      </div>
    </div>
  );
}

function HoverCard({
  node,
  totalCollabs,
  viewsLabel,
}: {
  node: CollabNode;
  totalCollabs: number;
  viewsLabel: string;
}) {
  const partners = collabEdges
    .filter((e) => e.from === node.id || e.to === node.id)
    .map((e) => {
      const otherId = e.from === node.id ? e.to : e.from;
      const other = collabNodes.find((n) => n.id === otherId);
      return { name: other?.fullName ?? otherId, count: e.count };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="pointer-events-none absolute top-16 right-6 z-10 w-64 rounded-lg border border-white/10 bg-[#0D0D0D]/95 p-4 shadow-xl backdrop-blur">
      <p className="font-mono text-[10px] tracking-wider text-white/40 uppercase">
        {node.initials} · {node.fullName}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-[11px] tabular-nums text-white/80">
        <div>
          <p className="text-[9px] tracking-wider text-white/40 uppercase">
            {viewsLabel}
          </p>
          <p className="text-base font-semibold text-white">
            {node.views30d.toFixed(1)}M
          </p>
        </div>
        <div>
          <p className="text-[9px] tracking-wider text-white/40 uppercase">
            Total Collabs
          </p>
          <p className="text-base font-semibold text-white">{totalCollabs}</p>
        </div>
      </div>
      <p className="mt-3 font-mono text-[10px] tracking-wider text-white/40 uppercase">
        Partners
      </p>
      <ul className="mt-1 space-y-0.5 text-xs text-white/80">
        {partners.map((p) => (
          <li key={p.name} className="flex items-center justify-between">
            <span>{p.name}</span>
            <span className="font-mono text-[11px] tabular-nums text-[#00C853]">
              {p.count}×
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const w = 160;
  const h = 36;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 h-9 w-full">
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
