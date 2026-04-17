import { ArrowUpRightIcon, ArrowDownRightIcon } from "lucide-react";

import { scorecards } from "@/lib/dashboard/data";

export function Scoreboard() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {scorecards.map((c) => {
        const Arrow =
          c.delta?.direction === "up" ? ArrowUpRightIcon : ArrowDownRightIcon;
        const deltaColor =
          c.delta?.direction === "up" ? "text-[#00C853]" : "text-[#FF1744]";

        return (
          <div
            key={c.label}
            className={[
              "group relative flex flex-col justify-between rounded-lg border bg-[#1A1A1A] p-5 transition",
              c.highlight
                ? "border-[#00C853]/60 shadow-[0_0_40px_-10px_rgba(0,200,83,0.4)]"
                : "border-white/5 hover:border-white/10",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="truncate font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                {c.label}
              </p>
              {c.highlight && (
                <span className="shrink-0 rounded-full bg-[#00C853]/10 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-[#00C853] uppercase">
                  Pitch
                </span>
              )}
            </div>
            <p
              className={[
                "mt-6 text-3xl font-semibold tracking-tight tabular-nums",
                c.highlight ? "text-[#00C853]" : "text-white",
              ].join(" ")}
            >
              {c.value}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-white/50">
              {c.delta && (
                <span
                  className={`flex items-center gap-0.5 font-medium tabular-nums ${deltaColor}`}
                >
                  <Arrow className="size-3" />
                  {c.delta.value}
                </span>
              )}
              <span className="truncate">{c.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
