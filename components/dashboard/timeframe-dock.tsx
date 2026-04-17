"use client";

import { timeframes } from "@/lib/dashboard/data";
import { useTimeframe } from "./timeframe-context";

export function TimeframeDock() {
  const { timeframe, setTimeframe } = useTimeframe();

  return (
    <div
      className="pointer-events-none fixed right-6 bottom-6 z-50 flex justify-end"
      aria-hidden={false}
    >
      <div
        role="tablist"
        aria-label="Timeframe"
        className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-white/10 bg-[#141414]/90 p-1 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.6)] backdrop-blur-md"
      >
        <span className="flex items-center gap-1.5 pr-2 pl-3 font-mono text-[9px] tracking-[0.22em] text-white/40 uppercase">
          <span className="size-1.5 rounded-full bg-[#00C853] shadow-[0_0_6px_#00C853]" />
          Timeframe
        </span>
        {timeframes.map((t) => {
          const active = t.key === timeframe;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTimeframe(t.key)}
              className={[
                "rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase transition",
                active
                  ? "bg-white text-[#0D0D0D] shadow-sm"
                  : "text-white/60 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
