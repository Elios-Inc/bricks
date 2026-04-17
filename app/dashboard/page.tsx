import { AudienceProfile } from "@/components/dashboard/audience-profile";
import { CollaborationNetwork } from "@/components/dashboard/collaboration-network";
import { GrowthTrajectory } from "@/components/dashboard/growth-trajectory";
import { MemberLeaderboard } from "@/components/dashboard/member-leaderboard";
import { PlatformCards } from "@/components/dashboard/platform-cards";
import { Scoreboard } from "@/components/dashboard/scoreboard";
import { Section } from "@/components/dashboard/section";
import { TopBar } from "@/components/dashboard/top-bar";
import { TopContent } from "@/components/dashboard/top-content";
import { ViewsOverTime } from "@/components/dashboard/views-over-time";

export const metadata = {
  title: "Analytics Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="isolate min-h-dvh bg-[#0D0D0D] text-white antialiased">
      <TopBar />

      <main className="mx-auto flex max-w-[1440px] flex-col gap-16 px-6 pt-10 pb-24">
        <Section
          eyebrow="01 · Collective Scoreboard"
          title="The BRICKS SLC snapshot"
          description="One month of output across 14 founding members. Every number below is what a sponsor sees first."
        >
          <Scoreboard />
        </Section>

        <Section
          eyebrow="02 · Audience Profile"
          title="Who's watching"
          description="A concentrated audience of Mountain West millennials with high disposable income and commercial intent."
        >
          <AudienceProfile />
        </Section>

        <Section
          eyebrow="03 · Views Over Time"
          title="30-day momentum, by platform"
          description="Stacked daily views across YouTube, TikTok, Instagram, and Facebook with a target line pacing to 100M/mo."
        >
          <ViewsOverTime />
        </Section>

        <Section
          eyebrow="04 · Member Leaderboard"
          title="14 members, ranked by reach"
          description="Click any member to expand their account-level breakdown across personal and BRICKS handles."
        >
          <MemberLeaderboard />
        </Section>

        <Section
          eyebrow="05 · Platform Breakdown"
          title="Each platform, as a mini business case"
          description="Views, followers, quality signal, CPM, and est. 30-day value per channel."
        >
          <PlatformCards />
        </Section>

        <Section
          eyebrow="06 · Top Content"
          title="Last 30 days' biggest hits"
          description="The 10 highest-performing pieces of content across the collective."
        >
          <TopContent />
        </Section>

        <Section
          eyebrow="07 · Growth Trajectory"
          title="The path to 100M monthly views"
          description="Six months of actuals, four months of projection. The inflection is scale + clipping."
        >
          <GrowthTrajectory />
        </Section>

        <Section
          eyebrow="08 · Collaboration Network"
          title="The network effect"
          description="Every line is a collaboration. Collab content outperforms solo content by 69%."
        >
          <CollaborationNetwork />
        </Section>
      </main>

      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 text-xs text-white/40">
          <span>© {new Date().getFullYear()} BRICKS SLC · All metrics 30-day window ending Apr 15, 2026</span>
          <span className="font-mono tracking-wider uppercase">
            Powered by Elios
          </span>
        </div>
      </footer>
    </div>
  );
}
