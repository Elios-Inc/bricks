import { collabEdges, collabNodes, collabStats } from "@/lib/dashboard/data";

const W = 1200;
const H = 500;

export function CollaborationNetwork() {
  const maxViews = Math.max(...collabNodes.map((n) => n.views));
  const minViews = Math.min(...collabNodes.map((n) => n.views));

  const nodeById = Object.fromEntries(
    collabNodes.map((n) => [n.id, n])
  );

  const radiusFor = (v: number) => {
    const t = (v - minViews) / (maxViews - minViews || 1);
    return 18 + t * 28;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-lg border border-white/5 bg-[#1A1A1A]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,200,83,0.06),transparent_60%)]" />
        <svg viewBox={`0 0 ${W} ${H}`} className="relative w-full">
          {collabEdges.map((e, i) => {
            const a = nodeById[e.from];
            const b = nodeById[e.to];
            if (!a || !b) return null;
            return (
              <line
                key={i}
                x1={a.x * W}
                y1={a.y * H}
                x2={b.x * W}
                y2={b.y * H}
                stroke="#ffffff"
                strokeOpacity={0.1 + (e.weight / 5) * 0.3}
                strokeWidth={0.5 + e.weight * 0.6}
              />
            );
          })}

          {collabNodes.map((n) => {
            const r = radiusFor(n.views);
            const cx = n.x * W;
            const cy = n.y * H;
            return (
              <g key={n.id}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={r + 4}
                  fill="#00C853"
                  opacity="0.08"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="#1A1A1A"
                  stroke="#00C853"
                  strokeWidth={1.5}
                />
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  className="fill-white font-mono text-[11px] font-semibold"
                >
                  {n.initials}
                </text>
                <text
                  x={cx}
                  y={cy + r + 14}
                  textAnchor="middle"
                  className="fill-white/60 text-[10px]"
                >
                  {n.name.split(" ").slice(-1)[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {collabStats.map((s) => (
          <div
            key={s.label}
            className={[
              "rounded-lg border bg-[#1A1A1A] p-5",
              s.highlight
                ? "border-[#00C853]/60 shadow-[0_0_40px_-10px_rgba(0,200,83,0.4)]"
                : "border-white/5",
            ].join(" ")}
          >
            <p className="truncate font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
              {s.label}
            </p>
            <p
              className={[
                "mt-3 text-3xl font-semibold tracking-tight tabular-nums",
                s.highlight ? "text-[#00C853]" : "text-white",
              ].join(" ")}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
