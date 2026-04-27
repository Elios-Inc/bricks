import { ActiveSectionProvider } from "@/components/dashboard/active-section-context";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DensityProvider } from "@/components/dashboard/density-context";
import { ShortimizeCredentialsForm } from "@/components/settings/shortimize-credentials-form";
import { TimeframeProvider } from "@/components/dashboard/timeframe-context";
import { getShortimizeStatus } from "@/lib/vendors/shortimize";

export const dynamic = "force-dynamic";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const shortimizeStatus = await getShortimizeStatus();

  const serializedStatus = {
    ...shortimizeStatus,
    expiresAt: shortimizeStatus.expiresAt?.toISOString() ?? null,
    lastUpdated: shortimizeStatus.lastUpdated?.toISOString() ?? null,
  };

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
                    System
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white text-balance">
                    Settings
                  </h1>
                  <p className="mt-2 text-sm text-white/50">
                    Manage integrations and credentials for the daily sync.
                  </p>
                </div>
              </header>

              <main className="mx-auto w-full max-w-[1440px] px-6 pt-8 pb-24">
                <section>
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-white">
                      Shortimize / ClipLabs
                    </h2>
                    <p className="mt-1 text-xs text-white/40">
                      Brett&apos;s clipping dashboard. Tokens auto-refresh on each
                      daily sync. If the chain breaks, paste a fresh session
                      cookie.
                    </p>
                  </div>
                  <div className="max-w-lg">
                    <ShortimizeCredentialsForm
                      initialStatus={serializedStatus}
                    />
                  </div>
                </section>
              </main>
            </div>
          </div>
        </DensityProvider>
      </ActiveSectionProvider>
    </TimeframeProvider>
  );
}
