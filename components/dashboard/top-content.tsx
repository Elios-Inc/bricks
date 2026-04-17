import { PlayIcon } from "lucide-react";

import { platformMeta, topContent } from "@/lib/dashboard/data";
import { PlatformIcon } from "./platform-icon";

export function TopContent() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {topContent.map((c) => {
        const color = platformMeta[c.platform].color;
        return (
          <article
            key={c.rank}
            className="group flex flex-col overflow-hidden rounded-lg border border-white/5 bg-[#1A1A1A] transition hover:border-white/10"
          >
            <div
              className="relative aspect-video w-full"
              style={{
                background: `linear-gradient(135deg, ${color}33 0%, #1A1A1A 60%)`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex size-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition group-hover:scale-110">
                  <PlayIcon className="size-4 fill-white text-white" />
                </div>
              </div>
              <span
                className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/70 backdrop-blur-sm"
                style={{ boxShadow: `0 0 0 1px ${color}66` }}
              >
                <PlatformIcon platform={c.platform} className="size-3.5" />
              </span>
              <span className="absolute top-2 left-2 rounded-full bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur-sm">
                #{c.rank}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
              <h3 className="truncate text-sm font-semibold text-white">
                {c.title}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex size-5 items-center justify-center rounded-full bg-linear-to-br from-white/15 to-white/5 font-mono text-[9px] font-semibold text-white/70">
                  {c.member
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <span className="truncate text-xs text-white/60">
                  {c.member}
                </span>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3 font-mono text-[11px] tabular-nums">
                <span className="font-semibold text-white">{c.views}</span>
                <span className="text-[#00C853]">{c.engagement}</span>
                <span className="text-white/40">{c.date}</span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
