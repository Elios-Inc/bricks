import Image from "next/image";
import { ArrowUpRightIcon, FlameIcon, MinusIcon, PlayIcon, TrendingDownIcon } from "lucide-react";

import { platformMeta, topContent } from "@/lib/dashboard/data";
import { PlatformIcon } from "./platform-icon";

const thumbnails = [
  "/images/social-thumbnails/01-laser-lambo-warehouse.png",
  "/images/social-thumbnails/02-mclaren-laser-explosion.png",
  "/images/social-thumbnails/03-triple-supercar-laser-grid.png",
  "/images/social-thumbnails/04-donuts-smoke-laser-chaos.png",
];

function trendBadge(trend: "hot" | "steady" | "cooling") {
  if (trend === "hot") {
    return {
      Icon: FlameIcon,
      cls: "bg-danger/15 text-danger-text border-danger/30",
      label: "Hot",
    };
  }
  if (trend === "cooling") {
    return {
      Icon: TrendingDownIcon,
      cls: "bg-white/5 text-white/60 border-white/10",
      label: "Cooling",
    };
  }
  return {
    Icon: MinusIcon,
    cls: "bg-warning/10 text-warning-text border-warning/30",
    label: "Steady",
  };
}

export function TopContent() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {topContent.map((c) => {
        const meta = platformMeta[c.platform];
        const badge = trendBadge(c.trend);
        const TrendIcon = badge.Icon;
        const thumbBg =
          c.platform === "instagram"
            ? "linear-gradient(135deg, rgba(245,133,41,0.28), rgba(221,42,123,0.24) 40%, rgba(129,52,175,0.22) 70%, var(--surface-overlay) 100%)"
            : `linear-gradient(135deg, ${meta.color}38 0%, ${meta.color}14 45%, var(--surface-overlay) 100%)`;

        return (
          <article
            key={c.rank}
            className="group flex flex-col overflow-hidden rounded-xl border border-white/5 bg-surface-overlay transition hover:border-white/15 hover:bg-surface-hover"
          >
            <a
              href={c.url}
              target="_blank"
              rel="noreferrer noopener"
              className="relative block aspect-video w-full overflow-hidden"
              style={{ background: thumbBg }}
            >
              <Image
                src={thumbnails[(c.rank - 1) % thumbnails.length]}
                alt={c.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.08),transparent_65%)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-black/55 backdrop-blur-md transition group-hover:scale-110">
                  <PlayIcon className="size-6 fill-white text-white" />
                </div>
              </div>
              <span className="absolute top-3 left-3 rounded-full bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white/90 backdrop-blur-sm">
                #{c.rank}
              </span>
              <span
                className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/75 backdrop-blur-sm"
                style={{ boxShadow: `0 0 0 1px ${meta.color}55` }}
              >
                <PlatformIcon platform={c.platform} className="size-4" />
              </span>
              <div
                className={`absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${badge.cls}`}
              >
                <TrendIcon className="size-3" />
                {badge.label}
              </div>
              <div className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-1 font-mono text-[10px] tabular-nums text-white/90 backdrop-blur-sm">
                {c.velocity}
              </div>
            </a>

            <div className="flex flex-1 flex-col gap-3 p-5">
              <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-white">
                {c.title}
              </h3>

              <div className="flex items-center gap-2">
                <div className="flex size-5 items-center justify-center rounded-full bg-linear-to-br from-white/15 to-white/5 font-mono text-[9px] font-semibold text-white/75">
                  {c.memberInitials}
                </div>
                <span className="truncate text-xs text-white/60">{c.member}</span>
                <span className="ml-auto font-mono text-[10px] tracking-wider text-white/40 uppercase">
                  {c.platformLabel}
                </span>
              </div>

              <div className="mt-auto flex items-end justify-between border-t border-white/5 pt-3">
                <div className="flex items-baseline gap-4 font-mono tabular-nums">
                  <div>
                    <p className="text-[9px] tracking-wider text-white/40 uppercase">
                      Views
                    </p>
                    <p className="text-base font-semibold text-white">
                      {c.views}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-wider text-white/40 uppercase">
                      Engagement
                    </p>
                    <p className="text-sm text-glow">{c.engagement}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-wider text-white/40 uppercase">
                      Posted
                    </p>
                    <p className="text-sm text-white/70">{c.date}</p>
                  </div>
                </div>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-0.5 rounded-md border border-white/10 px-2 py-1 text-[11px] font-medium text-white/85 transition hover:border-glow/50 hover:bg-glow/10 hover:text-glow"
                >
                  View on {c.platformLabel}
                  <ArrowUpRightIcon className="size-3" />
                </a>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
