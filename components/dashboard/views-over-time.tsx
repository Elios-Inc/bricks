import { dailyViews, platformMeta } from "@/lib/dashboard/data";

const W = 1200;
const H = 360;
const PAD = { top: 20, right: 20, bottom: 30, left: 60 };
const CW = W - PAD.left - PAD.right;
const CH = H - PAD.top - PAD.bottom;

const STACK_ORDER = ["tiktok", "youtube", "instagram", "facebook"] as const;

export function ViewsOverTime() {
  const days = dailyViews;
  const stacks = days.map((d) => {
    let y = 0;
    const parts = STACK_ORDER.map((key) => {
      const v = d[key];
      const entry = { key, y0: y, y1: y + v };
      y += v;
      return entry;
    });
    return { date: d.label, total: y, parts };
  });

  const maxTotal = Math.max(...stacks.map((s) => s.total));
  const yMax = Math.ceil(maxTotal / 250000) * 250000;
  const targetDaily = 3_333_333;

  const xFor = (i: number) =>
    PAD.left + (i / (days.length - 1)) * CW;
  const yFor = (v: number) => PAD.top + CH - (v / yMax) * CH;

  const areaForKey = (key: (typeof STACK_ORDER)[number]) => {
    const top = stacks
      .map((s, i) => {
        const p = s.parts.find((p) => p.key === key)!;
        return `${xFor(i)},${yFor(p.y1)}`;
      })
      .join(" ");
    const bottom = stacks
      .map((s, i) => {
        const p = s.parts.find((p) => p.key === key)!;
        return `${xFor(i)},${yFor(p.y0)}`;
      })
      .reverse()
      .join(" ");
    return `M${top} L${bottom} Z`;
  };

  const totalLine = stacks
    .map((s, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(s.total)}`)
    .join(" ");

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((r) => ({
    value: r * yMax,
    y: yFor(r * yMax),
  }));

  return (
    <div className="rounded-lg border border-white/5 bg-[#1A1A1A] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
            Daily Views by Platform · Mar 16 – Apr 15, 2026
          </p>
        </div>
        <ul role="list" className="flex flex-wrap items-center gap-4">
          {STACK_ORDER.map((k) => (
            <li key={k} className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-sm"
                style={{ background: platformMeta[k].color }}
              />
              <span className="text-xs text-white/70">
                {platformMeta[k].label}
              </span>
            </li>
          ))}
          <li className="flex items-center gap-2">
            <span className="h-0.5 w-4 border-t border-dashed border-white/60" />
            <span className="text-xs text-white/70">Daily total</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-0.5 w-4 border-t border-dashed border-[#00C853]" />
            <span className="text-xs text-white/70">100M/mo pace</span>
          </li>
        </ul>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          {STACK_ORDER.map((k) => (
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
                stopOpacity="0.9"
              />
              <stop
                offset="100%"
                stopColor={platformMeta[k].color}
                stopOpacity="0.5"
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
              stroke="#ffffff"
              strokeOpacity="0.05"
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

        {STACK_ORDER.map((k) => (
          <path key={k} d={areaForKey(k)} fill={`url(#grad-${k})`} />
        ))}

        <path
          d={totalLine}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          strokeOpacity="0.85"
        />

        <line
          x1={PAD.left}
          x2={W - PAD.right}
          y1={yFor(targetDaily)}
          y2={yFor(targetDaily)}
          stroke="#00C853"
          strokeWidth="1.25"
          strokeDasharray="6 6"
        />
        <text
          x={W - PAD.right - 4}
          y={yFor(targetDaily) - 6}
          textAnchor="end"
          className="fill-[#00C853] font-mono text-[10px]"
        >
          100M/mo pace · 3.33M/day
        </text>

        {days.map((d, i) =>
          i % 5 === 0 || i === days.length - 1 ? (
            <text
              key={d.date}
              x={xFor(i)}
              y={H - 8}
              textAnchor="middle"
              className="fill-white/40 font-mono text-[10px]"
            >
              {d.label}
            </text>
          ) : null
        )}
      </svg>
    </div>
  );
}
