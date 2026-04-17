"use client";

import { createContext, useContext, useMemo, useState } from "react";

import type { TimeframeKey } from "@/lib/dashboard/data";

type Ctx = {
  timeframe: TimeframeKey;
  setTimeframe: (t: TimeframeKey) => void;
};

const TimeframeContext = createContext<Ctx | null>(null);

export function TimeframeProvider({ children }: { children: React.ReactNode }) {
  const [timeframe, setTimeframe] = useState<TimeframeKey>("30D");
  const value = useMemo(() => ({ timeframe, setTimeframe }), [timeframe]);
  return (
    <TimeframeContext.Provider value={value}>
      {children}
    </TimeframeContext.Provider>
  );
}

export function useTimeframe() {
  const ctx = useContext(TimeframeContext);
  if (!ctx) {
    throw new Error("useTimeframe must be used inside <TimeframeProvider />");
  }
  return ctx;
}
