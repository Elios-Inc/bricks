"use client";

import { useMemo, useState } from "react";

type VideoStat = {
  videoId: string;
  title: string | null;
  adLink: string | null;
  platform: string;
  username: string;
  uploadedAt: string | null;
  views: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  bookmarks: number | null;
  engagementRate: number | null;
  outlierMultiplier: number | null;
};

type Props = { videos: VideoStat[] };

type SortBy =
  | "video"
  | "views"
  | "viral"
  | "engagementRate"
  | "likes"
  | "comments"
  | "shares"
  | "uploadedAt";

type SortDir = "asc" | "desc";

const sortLabels: Record<SortBy, string> = {
  video: "Video",
  views: "Views",
  viral: "Viral",
  engagementRate: "Eng%",
  likes: "Likes",
  comments: "Comments",
  shares: "Shares",
  uploadedAt: "Upload Date",
};

export function ClippingVideoStatsTable({ videos }: Props) {
  const [sortBy, setSortBy] = useState<SortBy>("views");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sortedVideos = useMemo(() => {
    return [...videos].sort((a, b) => compareVideos(a, b, sortBy, sortDir));
  }, [videos, sortBy, sortDir]);

  const handleSort = (column: SortBy) => {
    if (column === sortBy) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(column);
    setSortDir(column === "video" || column === "uploadedAt" ? "asc" : "desc");
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="border-b border-white/5 pb-4">
        <p className="font-mono text-[10px] tracking-[0.28em] text-white/40 uppercase">
          Library
        </p>
        <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-white">
          Video Stats
        </h2>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/5 bg-surface-overlay">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3.5">
          <p className="font-mono text-[10px] tracking-[0.22em] text-white/45 uppercase">
            {videos.length} videos <span aria-hidden="true">&middot;</span> Sorted by {sortLabels[sortBy]}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm">
            <colgroup>
              <col className="w-[30%]" />
              <col className="w-[10%]" />
              <col className="w-[8%]" />
              <col className="w-[8%]" />
              <col className="w-[10%]" />
              <col className="w-[10%]" />
              <col className="w-[10%]" />
              <col className="w-[14%]" />
            </colgroup>
            <thead>
              <tr className="text-left text-[10px] tracking-wider text-white/40 uppercase">
                <SortableHeader
                  label="Video"
                  column="video"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Views"
                  column="views"
                  align="right"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Viral"
                  column="viral"
                  align="right"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Eng%"
                  column="engagementRate"
                  align="right"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Likes"
                  column="likes"
                  align="right"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Comments"
                  column="comments"
                  align="right"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Shares"
                  column="shares"
                  align="right"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Upload Date"
                  column="uploadedAt"
                  align="right"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
              </tr>
            </thead>
            <tbody>
              {sortedVideos.map((video) => (
                <tr
                  key={video.videoId}
                  className="border-t border-white/5 transition hover:bg-white/5"
                >
                  <td className="max-w-[300px] px-3 py-3">
                    <div className="flex flex-col gap-1">
                      {video.adLink ? (
                        <a
                          href={video.adLink}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="truncate font-medium text-white transition hover:text-glow"
                        >
                          {video.title || "Untitled"}
                        </a>
                      ) : (
                        <span className="truncate font-medium text-white">
                          {video.title || "Untitled"}
                        </span>
                      )}
                      <span className="truncate text-xs text-white/45">
                        @{video.username} <span aria-hidden="true">&middot;</span> {video.platform}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right font-mono font-semibold text-white tabular-nums whitespace-nowrap">
                    {formatNum(video.views ?? 0)}
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold tabular-nums ${viralBadgeClass(video.outlierMultiplier)}`}
                    >
                      {formatMultiplier(video.outlierMultiplier)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right font-mono text-xs text-glow tabular-nums whitespace-nowrap">
                    {formatPercent(video.engagementRate)}
                  </td>
                  <td className="px-3 py-3 text-right font-mono text-white/70 tabular-nums whitespace-nowrap">
                    {formatNum(video.likes ?? 0)}
                  </td>
                  <td className="px-3 py-3 text-right font-mono text-white/70 tabular-nums whitespace-nowrap">
                    {formatNum(video.comments ?? 0)}
                  </td>
                  <td className="px-3 py-3 text-right font-mono text-white/70 tabular-nums whitespace-nowrap">
                    {formatNum(video.shares ?? 0)}
                  </td>
                  <td className="px-3 py-3 text-right text-white/60 whitespace-nowrap">
                    {video.uploadedAt ? formatDate(video.uploadedAt) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function SortableHeader({
  label,
  column,
  align = "left",
  sortBy,
  sortDir,
  onSort,
}: {
  label: string;
  column: SortBy;
  align?: "left" | "right";
  sortBy: SortBy;
  sortDir: SortDir;
  onSort: (column: SortBy) => void;
}) {
  const active = column === sortBy;

  return (
    <th
      onClick={() => onSort(column)}
      className={`cursor-pointer px-3 py-3 font-normal whitespace-nowrap ${align === "right" ? "text-right" : "text-left"}`}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1 text-current transition hover:text-white"
      >
        {label}
        {active ? (
          <span aria-hidden="true">{sortDir === "asc" ? "▲" : "▼"}</span>
        ) : null}
      </button>
    </th>
  );
}

function compareVideos(
  a: VideoStat,
  b: VideoStat,
  sortBy: SortBy,
  sortDir: SortDir
) {
  const direction = sortDir === "asc" ? 1 : -1;
  let result = 0;

  if (sortBy === "video") {
    result = (a.title || "Untitled").localeCompare(b.title || "Untitled");
  } else if (sortBy === "uploadedAt") {
    result = (a.uploadedAt ?? "").localeCompare(b.uploadedAt ?? "");
  } else {
    result = numericValue(a, sortBy) - numericValue(b, sortBy);
  }

  return result * direction;
}

function numericValue(video: VideoStat, sortBy: Exclude<SortBy, "video" | "uploadedAt">) {
  if (sortBy === "viral") return video.outlierMultiplier ?? 0;
  return video[sortBy] ?? 0;
}

function viralBadgeClass(multiplier: number | null) {
  if ((multiplier ?? 0) >= 10) return "border-glow/30 bg-glow/15 text-glow";
  if ((multiplier ?? 0) >= 2) {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  }
  return "border-white/10 bg-white/5 text-white/50";
}

function formatMultiplier(multiplier: number | null) {
  if (multiplier === null) return "-";
  return `${multiplier.toFixed(0)}x`;
}

function formatPercent(n: number | null) {
  if (n === null) return "-";
  return `${n.toFixed(1)}%`;
}

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}K`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}
