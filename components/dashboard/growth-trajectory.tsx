import {
  memberBaselines,
  trajectory,
  trajectoryMonths,
} from "@/lib/dashboard/data";

const W = 1200;
const H = 340;
const PAD = { top: 32, right: 48, bottom: 44, left: 60 };
const CW = W - PAD.left - PAD.right;
const CH = H - PAD.top - PAD.bottom;

const yMax = 110; // millions

const xFor = (i: number) =>
  PAD.left + (i / (trajectoryMonths.length - 1)) * CW;
const yFor = (v: number) => PAD.top + CH - (v / yMax) * CH;

function segmentPath(
  points: { i: number; v: number | null }[]
): string {
  // Break the path where values are null
  let out = "";
  let started = false;
  for (const p of points) {
    if (p.v == null) {
      started = false;
      continue;
    }
    const cmd = started ? "L" : "M";
    out += `${cmd}${xFor(p.i)},${yFor(p.v)} `;
    started = true;
  }
  return out.trim();
}

export function GrowthTrajectory() {
  const baselineSeries = trajectory.map((p, i) => ({ i, v: p.baseline }));
  const actualSeries = trajectory.map((p, i) => ({ i, v: p.actual }));
  const projectedSeries = trajectory.map((p, i) => ({ i, v: p.projected }));

  const actualPath = segmentPath(actualSeries);
  const projectedPath = segmentPath(projectedSeries);
  const baselinePath = segmentPath(baselineSeries);

  // Pre-compute stagger levels for annotations so adjacent labels don't overlap.
  // Each entry is 0 (base) or 1 (raised by ~14px).
  const annotationStagger: number[] = trajectory.map(() => 0);
  for (let i = 0; i < trajectory.length; i++) {
    if (!trajectory[i].annotation) continue;
    if (i > 0 && trajectory[i - 1].annotation) {
      annotationStagger[i] = annotationStagger[i - 1] === 0 ? 1 : 0;
    }
  }

  // Area fill under the actual + projected combined line
  const combined = trajectory.map((p, i) => ({
    i,
    v: p.actual ?? p.projected ?? null,
  }));
  const areaTop = combined
    .filter((p) => p.v != null)
    .map((p) => `${xFor(p.i)},${yFor(p.v as number)}`);
  const areaPath =
    areaTop.length > 1
      ? `M${areaTop[0]} L${areaTop.slice(1).join(" L")} L${xFor(trajectory.length - 1)},${yFor(0)} L${xFor(0)},${yFor(0)} Z`
      : "";

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border border-white/5 bg-surface-overlay">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-6 py-4">
          <p className="font-mono text-[10px] tracking-[0.22em] text-white/45 uppercase">
            Before BRICKS vs. After BRICKS · Sep 2025 → Aug 2026
          </p>
          <ul role="list" className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/65">
            <li className="flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 bg-glow" />
              <span>Actual (post-BRICKS)</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="inline-block h-0 w-4 border-t border-dashed border-glow" />
              <span>Projected</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="inline-block h-0 w-4 border-t border-dashed border-white/50" />
              <span>Onboarding baseline</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="inline-block h-0 w-4 border-t border-dashed border-white/70" />
              <span>100M/mo target</span>
            </li>
          </ul>
        </div>

        <div className="p-4">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            <defs>
              <linearGradient id="actualGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--glow)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--glow)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[0, 25, 50, 75, 100].map((v) => (
              <g key={v}>
                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={yFor(v)}
                  y2={yFor(v)}
                  stroke="white"
                  strokeOpacity="0.06"
                />
                <text
                  x={PAD.left - 10}
                  y={yFor(v) + 4}
                  textAnchor="end"
                  className="fill-white/40 font-mono text-[10px]"
                >
                  {v}M
                </text>
              </g>
            ))}

            {/* Target */}
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={yFor(100)}
              y2={yFor(100)}
              stroke="white"
              strokeOpacity="0.55"
              strokeWidth="1"
              strokeDasharray="6 6"
            />
            <text
              x={W - PAD.right - 4}
              y={yFor(100) - 6}
              textAnchor="end"
              className="fill-white/70 font-mono text-[10px]"
            >
              Target: 100M/mo
            </text>

            {/* Area */}
            <path d={areaPath} fill="url(#actualGrad)" />

            {/* Baseline */}
            <path
              d={baselinePath}
              fill="none"
              stroke="white"
              strokeOpacity="0.4"
              strokeWidth="1.25"
              strokeDasharray="4 5"
            />

            {/* Actual */}
            <path
              d={actualPath}
              fill="none"
              stroke="var(--glow)"
              strokeWidth="2.5"
            />

            {/* Projected */}
            <path
              d={projectedPath}
              fill="none"
              stroke="var(--glow)"
              strokeWidth="2"
              strokeDasharray="6 5"
              opacity="0.85"
            />

            {trajectory.map((p, i) => (
              <g key={p.month}>
                {p.actual != null && (
                  <circle
                    cx={xFor(i)}
                    cy={yFor(p.actual)}
                    r={4}
                    fill="var(--glow)"
                    stroke="var(--surface-base)"
                    strokeWidth="1.5"
                  />
                )}
                {p.projected != null && p.actual == null && (
                  <circle
                    cx={xFor(i)}
                    cy={yFor(p.projected)}
                    r={4}
                    fill="var(--surface-base)"
                    stroke="var(--glow)"
                    strokeWidth="1.5"
                  />
                )}
                <text
                  x={xFor(i)}
                  y={H - 14}
                  textAnchor="middle"
                  className="fill-white/45 font-mono text-[10px]"
                >
                  {p.month}
                </text>
                {p.annotation && (() => {
                  const pointY = yFor(p.actual ?? p.projected ?? 0);
                  const markerY = pointY - 12;
                  const stagger = annotationStagger[i] * 14;
                  const labelY = markerY - 8 - stagger;
                  const nearRightEdge = i > trajectory.length - 3;
                  const markerSize = 3;
                  return (
                    <g>
                      <line
                        x1={xFor(i)}
                        x2={xFor(i)}
                        y1={pointY - 2}
                        y2={markerY}
                        stroke="var(--glow)"
                        strokeOpacity="0.4"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                      <polygon
                        points={`${xFor(i)},${markerY - markerSize} ${xFor(i) + markerSize},${markerY} ${xFor(i)},${markerY + markerSize} ${xFor(i) - markerSize},${markerY}`}
                        fill="var(--glow)"
                      />
                      <text
                        x={xFor(i)}
                        y={labelY}
                        textAnchor={nearRightEdge ? "end" : "middle"}
                        className="font-mono text-[9px]"
                        fill="var(--glow)"
                      >
                        {p.annotation}
                      </text>
                    </g>
                  );
                })()}
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/5 bg-surface-overlay">
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <p className="font-mono text-[10px] tracking-[0.22em] text-white/45 uppercase">
            Per-member onboarding baseline → current 30D
          </p>
          <p className="font-mono text-[10px] tracking-wider text-white/40 uppercase">
            lift = (now − baseline) / baseline
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] tracking-wider text-white/40 uppercase">
                <th className="px-6 py-3 font-normal whitespace-nowrap">
                  Member
                </th>
                <th className="px-4 py-3 font-normal whitespace-nowrap">
                  Joined
                </th>
                <th className="px-4 py-3 text-right font-normal whitespace-nowrap">
                  Baseline (monthly)
                </th>
                <th className="px-4 py-3 text-right font-normal whitespace-nowrap">
                  Now (30D)
                </th>
                <th className="px-4 py-3 text-right font-normal whitespace-nowrap">
                  Lift
                </th>
              </tr>
            </thead>
            <tbody>
              {memberBaselines.map((m) => (
                <tr
                  key={m.id}
                  className="border-t border-white/5 text-white/85"
                >
                  <td className="px-6 py-2.5 text-white">{m.name}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-white/60 tabular-nums">
                    {m.joinedAt}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono tabular-nums">
                    {m.baseline}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-semibold tabular-nums">
                    {m.current}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-semibold text-glow tabular-nums">
                    {m.lift}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
