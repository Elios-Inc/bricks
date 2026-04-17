import Image from "next/image";
import Link from "next/link";
import {
  BarChart3Icon,
  UsersIcon,
  FileTextIcon,
  TrendingUpIcon,
  ArrowRightIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const pages = [
  {
    href: "/dashboard",
    icon: BarChart3Icon,
    title: "Analytics Dashboard",
    description:
      "Live views, follower growth, engagement rates, and platform breakdowns across all members.",
  },
  {
    href: "/members",
    icon: UsersIcon,
    title: "Members",
    description:
      "Tracked people and their public social accounts across every major platform.",
  },
  {
    href: "/content",
    icon: FileTextIcon,
    title: "Content",
    description:
      "Posts, reels, shorts, and videos with performance metrics and velocity tracking.",
  },
  {
    href: "/reports",
    icon: TrendingUpIcon,
    title: "Reports",
    description:
      "Weekly and monthly rollups showing real progress and pre-Bricks vs post-Bricks comparisons.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-4 px-4 py-4 sm:px-6">
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pages.map((page) => (
            <LinkCard key={page.href} {...page} />
          ))}
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Bricks SLC</p>
      </footer>
    </div>
  );
}

type LinkCardProps = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

function LinkCard({ href, icon: Icon, title, description }: LinkCardProps) {
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-colors group-hover:border-primary/40 group-hover:bg-accent/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base uppercase tracking-wide">
            <Icon className="size-5" />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <CardDescription>{description}</CardDescription>
          <span className="inline-flex items-center gap-1 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Open <ArrowRightIcon className="size-3.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
