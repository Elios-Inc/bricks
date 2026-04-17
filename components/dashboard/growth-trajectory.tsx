import { trajectory } from "@/lib/dashboard/data";

const W = 1200;
const H = 320;
const PAD = { top: 30, right: 40, bottom: 40, left: 60 };
const CW = W - PAD.left - PAD.right;
const CH = H - PAD.top - PAD.bottom;

export function GrowthTrajectory() {
  const yMax = 110;
  const xFor = (i: number) =>
    PAD.left + (i / (trajectory.length - 1)) * CW;
  const yFor = (v: number) => PAD.top + CH - (v / yMax) * CH;

  const actuals = trajectory.filter((p) => !p.projected);
  const projectedStart = actuals.length - 1;

  const actualsPath = actuals
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(p.views)}`
    )
    .join(" ");

  const projectedPath = trajectory
    .slice(projectedStart)
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"}${xFor(projectedStart + i)},${yFor(p.views)}`
    )
    .join(" ");

  const areaPath = `${actuals
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(p.views)}`
    )
    .join(" ")} L${xFor(projectedStart)},${yFor(0)} L${xFor(0)},${yFor(0)} Z`;

  return (
    <div className="rounded-lg border border-white/5 bg-[#1A1A1A] p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
          Monthly Views · Nov 2025 – Aug 2026
        </p>
        <ul role="list" className="flex items-center gap-4">
          <li className="flex items-center gap-2">
            <span className="h-0.5 w-4 bg-[#00C853]" />
            <span className="text-xs text-white/70">Actual</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-0.5 w-4 border-t border-dashed border-[#00C853]" />
            <span className="text-xs text-white/70">Projected</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-0.5 w-4 border-t border-dashed border-white/60" />
            <span className="text-xs text-white/70">Target</span>
          </li>
        </ul>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          <linearGradient id="actualGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#00C853" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00C853" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={yFor(v)}
              y2={yFor(v)}
              stroke="#ffffff"
              strokeOpacity="0.05"
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

        {/* Target line */}
        <line
          x1={PAD.left}
          x2={W - PAD.right}
          y1={yFor(100)}
          y2={yFor(100)}
          stroke="#ffffff"
          strokeOpacity="0.5"
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

        <path d={areaPath} fill="url(#actualGrad)" />
        <path d={actualsPath} fill="none" stroke="#00C853" strokeWidth="2" />
        <path
          d={projectedPath}
          fill="none"
          stroke="#00C853"
          strokeWidth="2"
          strokeDasharray="6 5"
          opacity="0.8"
        />

        {trajectory.map((p, i) => (
          <g key={p.month}>
            <circle
              cx={xFor(i)}
              cy={yFor(p.views)}
              r={4}
              fill={p.projected ? "#0D0D0D" : "#00C853"}
              stroke="#00C853"
              strokeWidth="2"
            />
            <text
              x={xFor(i)}
              y={H - 12}
              textAnchor="middle"
              className="fill-white/50 font-mono text-[10px]"
            >
              {p.month}
            </text>
            {p.annotation && (
              <g>
                <line
                  x1={xFor(i)}
                  x2={xFor(i)}
                  y1={yFor(p.views) - 10}
                  y2={yFor(p.views) - 28}
                  stroke="#ffffff"
                  strokeOpacity="0.3"
                />
                <text
                  x={xFor(i)}
                  y={yFor(p.views) - 34}
                  textAnchor="middle"
                  className="fill-white/80 font-mono text-[10px]"
                >
                  {p.annotation}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
