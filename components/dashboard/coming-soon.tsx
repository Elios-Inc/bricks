import type { LucideIcon } from "lucide-react";

import { ActiveSectionProvider } from "@/components/dashboard/active-section-context";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DensityProvider } from "@/components/dashboard/density-context";
import { TimeframeProvider } from "@/components/dashboard/timeframe-context";

type ComingSoonProps = {
  title: string;
  icon: LucideIcon;
  expected?: string;
};

export function ComingSoon({
  title,
  icon: Icon,
  expected = "Expected Q3 2026",
}: ComingSoonProps) {
  return (
    <TimeframeProvider>
      <ActiveSectionProvider>
        <DensityProvider>
        <div className="isolate flex min-h-dvh bg-[#0D0D0D] text-white antialiased [font-feature-settings:'ss01','cv11']">
          <AppSidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <main className="flex flex-1 items-center justify-center px-6 py-24">
              <div className="w-full max-w-md rounded-xl border border-white/5 bg-[#141414] p-12 text-center">
                <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-lg bg-white/5 text-white/70">
                  <Icon className="size-6" strokeWidth={1.75} />
                </div>
                <h1 className="text-xl font-semibold tracking-tight text-white">
                  {title}
                </h1>
                <p className="mt-2 text-[13px] text-white/55">
                  Tracking setup in progress
                </p>
                <p className="mt-6 font-mono text-[10px] tracking-[0.22em] text-white/35 uppercase">
                  {expected}
                </p>
              </div>
            </main>
          </div>
        </div>
        </DensityProvider>
      </ActiveSectionProvider>
    </TimeframeProvider>
  );
}
