"use client";

import {
  ArrowRightIcon,
  ClockIcon,
  HashIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useTimeframe } from "@/components/dashboard/timeframe-context";
import {
  members,
  navSections,
  timeframes,
  type TimeframeKey,
} from "@/lib/dashboard/data";

type CommandGroupKey = "sections" | "timeframe" | "members";

type CommandItem = {
  id: string;
  group: CommandGroupKey;
  label: string;
  sublabel?: string;
  run: () => void;
};

const GROUP_HEADINGS: Record<CommandGroupKey, string> = {
  sections: "Sections",
  timeframe: "Switch timeframe",
  members: "Members",
};

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: "smooth" });
  if (history.replaceState) history.replaceState(null, "", `#${id}`);
}

export function CommandPalette() {
  const { setTimeframe } = useTimeframe();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const allItems = useMemo<CommandItem[]>(() => {
    const sectionItems: CommandItem[] = navSections.map((s) => ({
      id: `section:${s.id}`,
      group: "sections",
      label: s.label,
      sublabel: s.number,
      run: () => scrollToId(s.id),
    }));
    const timeframeItems: CommandItem[] = timeframes.map((t) => ({
      id: `timeframe:${t.key}`,
      group: "timeframe",
      label: t.label,
      run: () => setTimeframe(t.key as TimeframeKey),
    }));
    const memberItems: CommandItem[] = members.map((m) => ({
      id: `member:${m.id}`,
      group: "members",
      label: m.name,
      sublabel: m.tags.join(" · "),
      run: () => scrollToId("leaderboard"),
    }));
    return [...sectionItems, ...timeframeItems, ...memberItems];
  }, [setTimeframe]);

  const filtered = useMemo<CommandItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((item) => item.label.toLowerCase().includes(q));
  }, [allItems, query]);

  const grouped = useMemo(() => {
    const groups: { key: CommandGroupKey; items: CommandItem[] }[] = [
      { key: "sections", items: [] },
      { key: "timeframe", items: [] },
      { key: "members", items: [] },
    ];
    for (const item of filtered) {
      const bucket = groups.find((g) => g.key === item.group);
      if (bucket) bucket.items.push(item);
    }
    return groups.filter((g) => g.items.length > 0);
  }, [filtered]);

  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Global keyboard shortcut to open/close the palette
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (openRef.current) {
          setOpen(false);
        } else {
          setQuery("");
          setActiveIndex(0);
          setOpen(true);
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Lock body scroll and focus the input when the palette is open
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);


  // Derive the clamped active index in render so we never point past the
  // filtered list after the query narrows.
  const safeActiveIndex =
    filtered.length === 0 ? 0 : Math.min(activeIndex, filtered.length - 1);

  // Scroll the active row into view
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${safeActiveIndex}"]`
    );
    if (node) {
      node.scrollIntoView({ block: "nearest" });
    }
  }, [safeActiveIndex, open]);

  if (!open) return null;

  function handleSelect(index: number) {
    const item = filtered[index];
    if (!item) return;
    item.run();
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filtered.length === 0) return;
      setActiveIndex((i) => (i + 1) % filtered.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filtered.length === 0) return;
      setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(safeActiveIndex);
      return;
    }
    if (e.key === "Tab") {
      // Simple focus trap: keep focus on the input
      e.preventDefault();
      inputRef.current?.focus();
    }
  }

  let runningIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="flex min-h-full items-start justify-center px-4 pt-[12vh]">
        <div
          className="w-full max-w-xl overflow-hidden rounded-xl border border-white/10 bg-surface-overlay shadow-2xl"
          onKeyDown={onKeyDown}
        >
          <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
            <SearchIcon
              className="size-4 shrink-0 text-white/40"
              strokeWidth={1.75}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              placeholder="Search sections, members, actions…"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div
            ref={listRef}
            className="max-h-[50vh] overflow-y-auto py-2"
            role="listbox"
          >
            {grouped.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-white/40">
                No matches
              </div>
            ) : (
              grouped.map((group) => (
                <div key={group.key} className="mb-1 last:mb-0">
                  <div className="px-4 pt-2 pb-1 font-mono text-[9px] tracking-wider text-white/40 uppercase">
                    {GROUP_HEADINGS[group.key]}
                  </div>
                  <ul>
                    {group.items.map((item) => {
                      runningIndex += 1;
                      const index = runningIndex;
                      const selected = index === safeActiveIndex;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={selected}
                            data-index={index}
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => handleSelect(index)}
                            className={[
                              "relative flex w-full items-center gap-3 px-4 py-2 text-left text-[13px] transition",
                              selected
                                ? "bg-white/10 text-white"
                                : "text-white/70 hover:bg-white/5",
                            ].join(" ")}
                          >
                            {selected && (
                              <span
                                aria-hidden
                                className="absolute inset-y-1 left-0 w-0.5 rounded-r bg-glow"
                              />
                            )}
                            <GroupIcon group={item.group} />
                            <span className="flex-1 truncate font-mono text-[12px]">
                              {item.label}
                            </span>
                            {item.sublabel ? (
                              <span className="font-mono text-[10px] tracking-wider text-white/30 uppercase">
                                {item.sublabel}
                              </span>
                            ) : null}
                            {selected ? (
                              <ArrowRightIcon
                                className="size-3.5 shrink-0 text-white/60"
                                strokeWidth={1.75}
                              />
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/5 px-4 py-2 font-mono text-[10px] tracking-wider text-white/40 uppercase">
            <span>BRICKS Command Palette</span>
            <span>⌘K to toggle · ↑↓ to navigate · ↵ to select</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupIcon({ group }: { group: CommandGroupKey }) {
  const common = "size-3.5 shrink-0 text-white/40";
  const strokeWidth = 1.75;
  if (group === "sections") {
    return <HashIcon className={common} strokeWidth={strokeWidth} />;
  }
  if (group === "timeframe") {
    return <ClockIcon className={common} strokeWidth={strokeWidth} />;
  }
  return <UserIcon className={common} strokeWidth={strokeWidth} />;
}
