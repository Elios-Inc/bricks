import {
  ageDistribution,
  audienceInterests,
  genderSplit,
  topGeographies,
} from "@/lib/dashboard/data";

function HorizontalBarChart({
  data,
  accent,
}: {
  data: { label: string; value: number }[];
  accent: string;
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <ul role="list" className="flex flex-col gap-2.5">
      {data.map((d) => (
        <li key={d.label} className="grid grid-cols-[90px_1fr_40px] items-center gap-3">
          <span className="truncate text-xs text-white/60">{d.label}</span>
          <div className="h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: accent,
              }}
            />
          </div>
          <span className="text-right font-mono text-xs tabular-nums text-white/80">
            {d.value}%
          </span>
        </li>
      ))}
    </ul>
  );
}

function DonutChart({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 160 160" className="size-40 -rotate-90">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#1A1A1A" strokeWidth="16" />
        {data.map((d, i) => {
          const dash = (d.value / total) * circumference;
          const el = (
            <circle
              key={d.label}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth="16"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              style={{ transition: `stroke-dasharray 0.4s ${i * 0.1}s` }}
            />
          );
          offset += dash;
          return el;
        })}
      </svg>

      <ul role="list" className="flex flex-col gap-2">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2">
            <span className="size-2 rounded-sm" style={{ background: d.color }} />
            <span className="text-xs text-white/60">{d.label}</span>
            <span className="font-mono text-xs tabular-nums text-white">
              {d.value}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-[#1A1A1A] p-5">
      <p className="mb-4 font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
        {title}
      </p>
      {children}
    </div>
  );
}

export function AudienceProfile() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="flex flex-col gap-4">
        <ChartCard title="Age Distribution">
          <HorizontalBarChart data={ageDistribution} accent="#00C853" />
        </ChartCard>
        <ChartCard title="Gender Split">
          <DonutChart data={genderSplit} />
        </ChartCard>
        <ChartCard title="Top Geographies">
          <HorizontalBarChart data={topGeographies} accent="#DD2A7B" />
        </ChartCard>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-white/5 bg-[#1A1A1A] p-8">
        <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
          Audience Summary
        </p>
        <p className="max-w-[62ch] text-lg leading-8 font-medium text-balance text-white/90">
          BRICKS SLC reaches an estimated{" "}
          <span className="text-[#00C853]">1.6M unique viewers</span> monthly.
          Core demographic: <span className="text-white">males 18–34</span> in
          the Mountain West. Primary interests: entrepreneurship, automotive,
          lifestyle, and fitness.{" "}
          <span className="text-white">72% US-based</span>, concentrated in
          Salt Lake City, Denver, Phoenix, and Los Angeles.
        </p>
        <ul role="list" className="mt-2 flex flex-wrap gap-2">
          {audienceInterests.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
            >
              {tag}
            </li>
          ))}
        </ul>

        <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-white/5 pt-6">
          <div>
            <dt className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
              Unique Viewers
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-white">
              1.6M
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
              US-Based
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-white">
              72%
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
              Primary Gender
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-white">
              Male 68%
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
              Primary Age
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-white">
              25–34
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
