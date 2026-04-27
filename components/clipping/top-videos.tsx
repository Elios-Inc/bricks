import { ArrowUpRightIcon } from "lucide-react";

type TopVideo = {
  videoId: string;
  title: string | null;
  adLink: string | null;
  platform: string;
  username: string;
  views: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  engagementRate: number | null;
  outlierMultiplier: number | null;
};

type Props = { videos: TopVideo[] };

export function ClippingTopVideos({ videos }: Props) {
  return (
    <section className="flex flex-col gap-6">
      <div className="border-b border-white/5 pb-4">
        <p className="font-mono text-[10px] tracking-[0.28em] text-white/40 uppercase">
          Performance
        </p>
        <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-white">
          Most Viral Videos
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <article
            key={video.videoId}
            className="group flex flex-col overflow-hidden rounded-xl border border-white/5 bg-surface-overlay transition hover:border-white/15 hover:bg-surface-hover"
          >
            <div className="flex h-full flex-col gap-3 p-5">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-glow/15 font-mono text-[10px] font-semibold text-glow uppercase">
                  {video.platform.slice(0, 1)}
                </span>
                <span className="text-xs text-white/60">@{video.username}</span>
                <span className="text-xs text-white/30">{video.platform}</span>
              </div>
              <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-white">
                {video.title || "Untitled"}
              </h3>
              <div className="mt-auto flex items-end justify-between border-t border-white/5 pt-3">
                <div className="flex items-baseline gap-4 font-mono tabular-nums">
                  <div>
                    <p className="text-[9px] tracking-wider text-white/40 uppercase">
                      Views
                    </p>
                    <p className="text-base font-semibold text-white">
                      {formatNum(video.views ?? 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-wider text-white/40 uppercase">
                      Engagement
                    </p>
                    <p className="text-sm text-glow">
                      {formatPercent(video.engagementRate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-wider text-white/40 uppercase">
                      Likes
                    </p>
                    <p className="text-sm text-white/70">
                      {formatNum(video.likes ?? 0)}
                    </p>
                  </div>
                </div>
              </div>
              {video.adLink && (
                <a
                  href={video.adLink}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-0.5 text-[11px] text-white/60 transition hover:text-glow"
                >
                  View on {video.platform} <ArrowUpRightIcon className="size-3" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}K`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatPercent(n: number | null) {
  if (n === null) return "-";
  return `${n.toFixed(1)}%`;
}
