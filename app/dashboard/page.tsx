import { ActiveSectionProvider } from "@/components/dashboard/active-section-context";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Collaboration } from "@/components/dashboard/collaboration";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { ContentTypePerformance } from "@/components/dashboard/content-type-performance";
import { CrossPostingMatrix } from "@/components/dashboard/cross-posting-matrix";
import { DensityProvider } from "@/components/dashboard/density-context";
import { GrowthTrajectory } from "@/components/dashboard/growth-trajectory";
import { MemberLeaderboard } from "@/components/dashboard/member-leaderboard";
import { PlatformCards } from "@/components/dashboard/platform-cards";
import { Scoreboard } from "@/components/dashboard/scoreboard";
import { Section } from "@/components/dashboard/section";
import { TimeframeDock } from "@/components/dashboard/timeframe-dock";
import { TimeframeProvider } from "@/components/dashboard/timeframe-context";
import { TopBar } from "@/components/dashboard/top-bar";
import { TopContent } from "@/components/dashboard/top-content";
import { ViewsOverTime } from "@/components/dashboard/views-over-time";

export const metadata = {
  title: "BRICKS SLC · Analytics Dashboard",
};

export default function DashboardPage() {
  return (
    <TimeframeProvider>
      <ActiveSectionProvider>
      <DensityProvider>
      <div className="isolate flex min-h-dvh bg-surface-base text-white antialiased [font-feature-settings:'ss01','cv11']">
        <AppSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />

          <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-14 px-6 pt-10 pb-24">
          <Section
            id="scoreboard"
            eyebrow="01 · Overview"
            title="Collective snapshot"
            description="Six numbers anyone can verify in public data. No creator-dashboard screenshots."
          >
            <Scoreboard />
          </Section>

          <Section
            id="views-over-time"
            eyebrow="02 · Views Over Time"
            title="Daily views, by platform"
            description="Stacked daily views with a prior-period overlay and the 3.33M/day threshold to reach 100M/month."
          >
            <ViewsOverTime />
          </Section>

          <Section
            id="platform-breakdown"
            eyebrow="03 · Platform Breakdown"
            title="Performance by channel"
            description="Views, followers, public engagement rate, and blended CPM per platform."
          >
            <PlatformCards />
          </Section>

          <Section
            id="content-type"
            eyebrow="04 · Content Types"
            title="Performance by format"
            description="Long-form carries depth, short-form carries reach. Allocation and engagement by format."
          >
            <ContentTypePerformance />
          </Section>

          <Section
            id="top-content"
            eyebrow="05 · Top Content"
            title="This month's breakouts"
            description="The 30-day hero posts with live platform links and velocity. Click any thumbnail to verify."
          >
            <TopContent />
          </Section>

          <Section
            id="leaderboard"
            eyebrow="06 · Members"
            title="14 members, ranked"
            description="Toggle between right-now attention (views) and compounding asset (followers). Green engagement above 4%."
          >
            <MemberLeaderboard />
          </Section>

          <Section
            id="collaboration"
            eyebrow="07 · Collaboration"
            title="Collab activity"
            description="Collab content outperforms solo by 69%. Node size reflects combined reach. Hover for partner detail."
          >
            <Collaboration />
          </Section>

          <Section
            id="cross-posting"
            eyebrow="08 · Cross-posting"
            title="Cross-posting this week"
            description="A green cell means the row's member cross-posted to the column's account this week. Target is 2+ incoming per member."
          >
            <CrossPostingMatrix />
          </Section>

          <Section
            id="trajectory"
            eyebrow="09 · Growth Trajectory"
            title="Growth since joining"
            description="Each member's onboarding baseline against current performance. Every number is a measured delta, not a projection."
          >
            <GrowthTrajectory />
          </Section>
          </main>

          <footer className="border-t border-white/5 py-8">
            <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-3 px-6 text-[11px] text-white/40">
              <span>
                © {new Date().getFullYear()} BRICKS SLC · All metrics sourced
                from public platform data · Last refresh Apr 15, 2026
              </span>
              <span className="font-mono tracking-[0.2em] uppercase">
                Powered by Elios
              </span>
            </div>
          </footer>
        </div>
      </div>
      <TimeframeDock />
      <CommandPalette />
      </DensityProvider>
      </ActiveSectionProvider>
    </TimeframeProvider>
  );
}
