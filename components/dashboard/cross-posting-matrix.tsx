"use client";

import { CheckIcon } from "lucide-react";

import {
  crossPostIncoming,
  crossPostMatrix,
  crossPostMembers,
  timeframePhrase,
} from "@/lib/dashboard/data";
import { useDensity } from "./density-context";
import { useTimeframe } from "./timeframe-context";

export function CrossPostingMatrix() {
  const { timeframe } = useTimeframe();
  const { density } = useDensity();
  const compact = density === "compact";
  const cellSize = compact ? "size-4" : "size-6";
  const rowPad = compact ? "py-0.5" : "py-1.5";
  const tfPhrase = timeframePhrase(timeframe);
  const incomingById = Object.fromEntries(
    crossPostIncoming.map((c) => [c.id, c.count])
  );

  const meets = crossPostIncoming.filter((c) => c.count >= 2).length;

  return (
    <div className="overflow-hidden rounded-xl border border-white/5 bg-surface-overlay">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-6 py-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] text-white/45 uppercase">
            Cross-post Matrix · {tfPhrase}
          </p>
          <p className="mt-1 text-xs text-white/50">
            Green cell = member in that row cross-posted to the column
            member&apos;s account at least once this week.
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="flex size-4 items-center justify-center rounded-[4px] bg-glow/90">
              <CheckIcon className="size-2.5 text-surface-base" strokeWidth={3.5} />
            </span>
            <span className="text-white/65">cross-posted</span>
          </div>
          <div className="font-mono tracking-wider text-white/45">
            Target: 2+ incoming per member ·{" "}
            <span className="font-semibold text-white">
              {meets}/{crossPostMembers.length} met
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="h-28">
              <th className="sticky left-0 z-10 w-40 bg-surface-overlay px-4 align-bottom pb-2 text-left font-mono text-[9px] tracking-wider text-white/40 uppercase">
                FROM ↓ TO →
              </th>
              {crossPostMembers.map((m) => (
                <th
                  key={m.id}
                  className="w-10 px-0 align-bottom"
                >
                  <div className="flex h-28 items-end justify-center">
                    <span
                      className="origin-bottom-left whitespace-nowrap font-mono text-[10px] text-white/55"
                      style={{ transform: "translateX(10px) rotate(-55deg)" }}
                    >
                      {m.lastName}
                    </span>
                  </div>
                </th>
              ))}
              <th className="sticky right-0 z-10 bg-surface-overlay px-3 align-bottom pb-2 text-right font-mono text-[9px] tracking-wider text-white/40 uppercase">
                Out
              </th>
            </tr>
          </thead>
          <tbody>
            {crossPostMembers.map((from, i) => {
              const outCount = crossPostMatrix[i].filter(Boolean).length;
              return (
                <tr key={from.id} className="border-t border-white/5">
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 bg-surface-overlay px-4 ${rowPad} text-left font-mono text-[11px] font-medium text-white/85 whitespace-nowrap`}
                  >
                    {from.lastName}
                  </th>
                  {crossPostMembers.map((to, j) => {
                    const isDiag = i === j;
                    const crossed = crossPostMatrix[i][j];
                    return (
                      <td key={to.id} className="p-0.5">
                        {isDiag ? (
                          <div
                            className={`mx-auto ${cellSize} rounded-[4px] bg-white/[0.04]`}
                            aria-hidden
                          />
                        ) : crossed ? (
                          <div
                            title={`${from.lastName} → ${to.lastName}: cross-posted this week`}
                            className={`mx-auto flex ${cellSize} items-center justify-center rounded-[4px] bg-glow/85 shadow-[0_0_10px_-3px_var(--glow)]`}
                          >
                            <CheckIcon
                              className={compact ? "size-2 text-surface-base" : "size-3 text-surface-base"}
                              strokeWidth={3.5}
                            />
                          </div>
                        ) : (
                          <div
                            className={`mx-auto ${cellSize} rounded-[4px] border border-white/[0.06]`}
                            aria-hidden
                          />
                        )}
                      </td>
                    );
                  })}
                  <td className={`sticky right-0 z-10 bg-surface-overlay px-3 ${rowPad} text-right font-mono text-xs text-white/70 tabular-nums`}>
                    {outCount}
                  </td>
                </tr>
              );
            })}
            <tr className="border-t border-white/5 bg-surface-raised">
              <th
                scope="row"
                className="sticky left-0 z-10 bg-surface-raised px-4 py-2 text-left font-mono text-[10px] tracking-wider text-white/45 uppercase"
              >
                Incoming
              </th>
              {crossPostMembers.map((m) => {
                const c = incomingById[m.id] ?? 0;
                const good = c >= 2;
                return (
                  <td
                    key={m.id}
                    className={`px-0 py-2 text-center font-mono text-[11px] tabular-nums ${good ? "text-glow" : "text-warning"}`}
                  >
                    {c}
                  </td>
                );
              })}
              <td className="sticky right-0 z-10 bg-surface-raised px-3 py-2 text-right" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
