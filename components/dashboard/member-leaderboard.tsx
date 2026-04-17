"use client";

import { Fragment, useState } from "react";
import { ChevronDownIcon, ArrowUpRightIcon } from "lucide-react";

import { brettDetail, members, type Member } from "@/lib/dashboard/data";
import { PlatformIcon } from "./platform-icon";

function formatViews(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toString();
}

function medal(rank: number) {
  if (rank === 1) return "#FFD700";
  if (rank === 2) return "#C0C0C0";
  if (rank === 3) return "#CD7F32";
  return null;
}

function engColor(eng: number) {
  if (eng > 4) return "text-[#00C853]";
  if (eng >= 2) return "text-[#FFA000]";
  return "text-[#FF1744]";
}

function tagColor(tag: string) {
  const map: Record<string, string> = {
    fitness: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    lifestyle: "bg-pink-500/10 text-pink-300 border-pink-500/20",
    entrepreneurship: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    automotive: "bg-red-500/10 text-red-300 border-red-500/20",
    tech: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    content: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    wellness: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  };
  return map[tag] ?? "bg-white/5 text-white/70 border-white/10";
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul role="list" className="flex flex-wrap gap-1">
      {tags.map((t) => (
        <li
          key={t}
          className={`rounded-full border px-1.5 py-0.5 text-[10px] tracking-wide ${tagColor(t)}`}
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  return (
    <div
      className="flex items-center justify-center rounded-full bg-linear-to-br from-white/15 to-white/5 font-mono text-[11px] font-semibold text-white/80"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
}

function ExpandedDetail({ member }: { member: Member }) {
  if (member.id !== "chell") {
    return (
      <div className="rounded-md border border-dashed border-white/10 p-6 text-center text-xs text-white/50">
        Detailed breakdown for {member.name} coming soon.
        <br />
        <a
          href="#"
          className="mt-2 inline-flex items-center gap-1 text-xs text-[#00C853]"
        >
          View Full Profile <ArrowUpRightIcon className="size-3" />
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {(["personal", "bricks"] as const).map((group) => (
        <div key={group}>
          <p className="mb-3 font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
            {group === "personal" ? "Personal Accounts" : "BRICKS Accounts"}
          </p>
          <div className="overflow-hidden rounded-md border border-white/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-[10px] tracking-wider text-white/40 uppercase">
                  <th className="px-3 py-2 font-normal whitespace-nowrap">
                    Platform
                  </th>
                  <th className="px-3 py-2 font-normal whitespace-nowrap">
                    Handle
                  </th>
                  <th className="px-3 py-2 text-right font-normal whitespace-nowrap">
                    Views
                  </th>
                  <th className="px-3 py-2 text-right font-normal whitespace-nowrap">
                    Eng%
                  </th>
                  <th className="px-3 py-2 text-right font-normal whitespace-nowrap">
                    Followers
                  </th>
                  <th className="px-3 py-2 text-right font-normal whitespace-nowrap">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody>
                {brettDetail[group].map((row) => (
                  <tr
                    key={`${row.platform}-${row.handle}`}
                    className="border-t border-white/5 text-white/80 first:border-t-0"
                  >
                    <td className="px-3 py-2">
                      <PlatformIcon platform={row.platform} className="size-4" />
                    </td>
                    <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">
                      {row.handle}
                    </td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">
                      {row.views}
                    </td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">
                      {row.engagement}
                    </td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">
                      {row.followers}
                    </td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums text-[#00C853]">
                      {row.growth}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="lg:col-span-2">
        <a
          href="#"
          className="inline-flex items-center gap-1 text-xs font-medium text-[#00C853] transition hover:text-[#00C853]/80"
        >
          View Full Profile <ArrowUpRightIcon className="size-3" />
        </a>
      </div>
    </div>
  );
}

export function MemberLeaderboard() {
  const [expanded, setExpanded] = useState<string | null>("chell");

  return (
    <div className="overflow-hidden rounded-lg border border-white/5 bg-[#1A1A1A]">
      <div className="-my-2 overflow-x-auto whitespace-nowrap">
        <div className="inline-block min-w-full py-2 align-middle">
          <table className="w-full text-sm">
            <thead className="border-b border-white/5">
              <tr className="text-left text-[10px] tracking-wider text-white/40 uppercase">
                <th className="px-4 py-3 font-normal whitespace-nowrap">#</th>
                <th className="px-4 py-3 font-normal whitespace-nowrap">
                  Member
                </th>
                <th className="px-4 py-3 text-right font-normal whitespace-nowrap">
                  Total Views
                </th>
                <th className="px-4 py-3 text-right font-normal whitespace-nowrap">
                  YouTube
                </th>
                <th className="px-4 py-3 text-right font-normal whitespace-nowrap">
                  TikTok
                </th>
                <th className="px-4 py-3 text-right font-normal whitespace-nowrap">
                  Instagram
                </th>
                <th className="px-4 py-3 text-right font-normal whitespace-nowrap">
                  Eng%
                </th>
                <th className="px-4 py-3 text-right font-normal whitespace-nowrap">
                  Growth
                </th>
                <th className="px-4 py-3 text-right font-normal whitespace-nowrap">
                  Top Post
                </th>
                <th className="px-4 py-3 font-normal whitespace-nowrap" />
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const isExpanded = expanded === m.id;
                const medalColor = medal(m.rank);
                return (
                  <Fragment key={m.id}>
                    <tr
                      onClick={() => setExpanded(isExpanded ? null : m.id)}
                      className={[
                        "cursor-pointer border-t border-white/5 transition hover:bg-white/5",
                        isExpanded && "bg-white/5",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {medalColor ? (
                            <span
                              className="flex size-6 items-center justify-center rounded-full font-mono text-[10px] font-semibold text-[#0D0D0D]"
                              style={{ background: medalColor }}
                            >
                              {m.rank}
                            </span>
                          ) : (
                            <span className="font-mono text-xs text-white/50 tabular-nums">
                              {m.rank}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={m.name} />
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-white">
                              {m.name}
                            </span>
                            <Tags tags={m.tags} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-white tabular-nums">
                        {formatViews(m.totalViews)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-white/70 tabular-nums">
                        {formatViews(m.youtube)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-white/70 tabular-nums">
                        {formatViews(m.tiktok)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-white/70 tabular-nums">
                        {formatViews(m.instagram)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-mono text-xs font-semibold tabular-nums ${engColor(m.engagement)}`}
                      >
                        {m.engagement.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-[#00C853] tabular-nums">
                        +{m.growth.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-white/70 tabular-nums">
                        {formatViews(m.topPost)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ChevronDownIcon
                          className={`size-4 text-white/40 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="border-t border-white/5 bg-[#141414]">
                        <td colSpan={10} className="px-6 py-6">
                          <ExpandedDetail member={m} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
