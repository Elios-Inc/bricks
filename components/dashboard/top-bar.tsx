"use client";

import { useEffect, useState } from "react";
import { ChevronRightIcon, LayoutGridIcon, RowsIcon } from "lucide-react";
import { useActiveSection } from "./active-section-context";
import { useDensity } from "./density-context";
import { navSections } from "@/lib/dashboard/data";

export function TopBar() {
  const activeId = useActiveSection();
  const active = navSections.find((s) => s.id === activeId);
  const { density, toggle } = useDensity();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 120);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const subHeaderVisible = scrolled && Boolean(active);

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-surface-base/85 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-6 px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <p className="font-mono text-[9px] tracking-[0.25em] text-white/40 uppercase">
            Analytics
          </p>
          <ChevronRightIcon className="size-3 text-white/25" strokeWidth={2} />
          <h1 className="text-[13px] font-semibold tracking-tight text-white">
            Collective Dashboard
          </h1>
          {active && (
            <>
              <ChevronRightIcon className="size-3 text-white/25" strokeWidth={2} />
              <span className="flex items-center gap-1.5 text-[12px] text-white/55">
                <span className="font-mono text-[9px] tracking-wider text-white/35">
                  {active.number}
                </span>
                {active.label}
              </span>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${density === "comfortable" ? "compact" : "comfortable"} density`}
            aria-pressed={density === "compact"}
            title={density === "comfortable" ? "Comfortable · click for compact" : "Compact · click for comfortable"}
            className="flex size-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white/60 transition hover:border-white/20 hover:text-white"
          >
            {density === "comfortable" ? (
              <RowsIcon className="size-3.5" strokeWidth={2} />
            ) : (
              <LayoutGridIcon className="size-3.5" strokeWidth={2} />
            )}
          </button>
          <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] text-white/40 uppercase">
            <span className="size-1.5 rounded-full bg-glow shadow-[0_0_6px_var(--glow)]" />
            Live · Apr 15, 2026
          </div>
        </div>
      </div>

      <div
        className={`flex h-9 items-center justify-between border-t border-white/5 bg-surface-base/95 px-6 py-2.5 backdrop-blur transition-all duration-200 ${
          subHeaderVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-full opacity-0"
        }`}
        aria-hidden={!subHeaderVisible}
      >
        {active && (
          <span className="font-mono text-[10px] tracking-[0.22em] text-glow/80 uppercase">
            {active.number} · {active.label}
          </span>
        )}
      </div>
    </header>
  );
}
