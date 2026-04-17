"use client";

import { ArrowDownRightIcon, ArrowUpRightIcon } from "lucide-react";

import { scoreboardByTimeframe } from "@/lib/dashboard/data";
import { useDensity } from "./density-context";
import { useTimeframe } from "./timeframe-context";

export function Scoreboard() {
  const { timeframe } = useTimeframe();
  const { density } = useDensity();
  const compact = density === "compact";
  const cards = scoreboardByTimeframe[timeframe];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {cards.map((c) => {
        const Arrow =
          c.delta?.direction === "up" ? ArrowUpRightIcon : ArrowDownRightIcon;
        const deltaColor =
          c.delta?.direction === "up" ? "text-[#00C853]" : "text-[#FF1744]";

        return (
          <div
            key={c.key}
            className={`group relative flex flex-col justify-between rounded-xl border border-white/5 bg-[#141414] transition hover:border-white/15 hover:bg-[#181818] ${
              compact ? "gap-3 p-3" : "gap-6 p-5"
            }`}
          >
            <p className="font-mono text-[10px] leading-snug tracking-[0.15em] text-white/45 uppercase">
              {c.label}
            </p>

            <div>
              <p
                className={`leading-none font-semibold tracking-tight text-white tabular-nums ${
                  compact ? "text-[20px]" : "text-[26px]"
                }`}
              >
                {c.value}
              </p>
              <div className="mt-2 flex flex-col gap-0.5 text-[11px] text-white/50">
                {c.delta && (
                  <span
                    className={`inline-flex items-center gap-0.5 font-medium tabular-nums ${deltaColor}`}
                  >
                    <Arrow className="size-3" />
                    {c.delta.value}
                  </span>
                )}
                <span className="leading-snug">{c.subtext}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
