import { ClippingKpiCards } from "@/components/clipping/kpi-cards";
import { ClippingMetricsBreakdown } from "@/components/clipping/metrics-breakdown";
import { ClippingTopVideos } from "@/components/clipping/top-videos";
import { ClippingVideoStatsTable } from "@/components/clipping/video-stats-table";
import { ClippingViewsChart } from "@/components/clipping/views-chart";
import { ActiveSectionProvider } from "@/components/dashboard/active-section-context";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DensityProvider } from "@/components/dashboard/density-context";
import { TimeframeProvider } from "@/components/dashboard/timeframe-context";
import {
  getClippingKpis,
  getDailyMetrics,
  getTopVideos,
  getVideoStats,
} from "@/lib/clipping/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Clipping" };

export default async function ClippingPage() {
  const [kpis, dailyMetrics, topVideos, videoStats] = await Promise.all([
    getClippingKpis(),
    getDailyMetrics(),
    getTopVideos(3),
    getVideoStats(),
  ]);

  return (
    <TimeframeProvider>
      <ActiveSectionProvider>
        <DensityProvider>
          <div className="isolate flex min-h-dvh bg-surface-base text-white antialiased [font-feature-settings:'ss01','cv11']">
            <AppSidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <header className="relative overflow-hidden border-b border-white/5 px-6 py-8">
                <div className="pointer-events-none absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-glow/8 blur-[100px]" />
                <div className="relative mx-auto w-full max-w-[1440px]">
                  <p className="font-mono text-[0.625rem] tracking-[0.28em] text-glow/70 uppercase">
                    Analytics
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white text-balance">
                    Clipping
                  </h1>
                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/50">
                    <span>
                      <span className="tabular-nums font-semibold text-white">
                        {formatNum(kpis.totalViews)}
                      </span>{" "}
                      total views
                    </span>
                    <span className="text-white/20">&middot;</span>
                    <span>
                      <span className="tabular-nums font-semibold text-white">
                        {kpis.daysCount}
                      </span>{" "}
                      days tracked
                    </span>
                    <span className="text-white/20">&middot;</span>
                    <span>
                      <span className="tabular-nums font-semibold text-white">
                        {videoStats.length}
                      </span>{" "}
                      videos
                    </span>
                  </p>
                </div>
              </header>

              <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-14 px-6 pt-10 pb-24">
                <ClippingKpiCards kpis={kpis} />
                <ClippingViewsChart dailyMetrics={dailyMetrics} />
                <ClippingTopVideos videos={topVideos} />
                <ClippingMetricsBreakdown dailyMetrics={dailyMetrics} />
                <ClippingVideoStatsTable videos={videoStats} />
              </main>
            </div>
          </div>
        </DensityProvider>
      </ActiveSectionProvider>
    </TimeframeProvider>
  );
}

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}K`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}
