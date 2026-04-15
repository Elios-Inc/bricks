import Image from "next/image";
import {
  BarChart3Icon,
  UsersIcon,
  TrendingUpIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6">
          <Image
            src="/logo-white.png"
            alt="Bricks"
            width={120}
            height={40}
            className=""
            priority
          />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-12 sm:px-6">
        <section className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-black uppercase tracking-wide sm:text-5xl">
            Brand House
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Track social media performance across Instagram, TikTok, YouTube,
            and Facebook Reels. Daily snapshots. Weekly and monthly rollups.
            Growth over time.
          </p>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<UsersIcon className="size-5" />}
            title="Member Tracking"
            description="Manage tracked people and their public social accounts across every major platform."
          />
          <FeatureCard
            icon={<BarChart3Icon className="size-5" />}
            title="Daily Snapshots"
            description="Automated daily collection of profile metrics, content performance, and follower counts."
          />
          <FeatureCard
            icon={<TrendingUpIcon className="size-5" />}
            title="Growth Evidence"
            description="Weekly and monthly rollups that show real progress and pre-Bricks vs post-Bricks comparisons."
          />
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Bricks SLC</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base uppercase tracking-wide">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
