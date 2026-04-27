"use client";

import {
  BarChart3Icon,
  ChevronDownIcon,
  FileTextIcon,
  LayoutGridIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  SettingsIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { navSections } from "@/lib/dashboard/data";
import { useActiveSection } from "./active-section-context";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  disabled?: boolean;
};

const primaryNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3Icon },
  { href: "/members", label: "Members", icon: UsersIcon, badge: "17" },
  { href: "/content", label: "Content", icon: LayoutGridIcon, disabled: true },
  { href: "/reports", label: "Reports", icon: FileTextIcon, disabled: true },
];

const secondaryNav: NavItem[] = [
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

const STORAGE_KEY = "bricks.sidebar.collapsed";
const TOC_STORAGE_KEY = "bricks.sidebar.tocExpanded";

function readInitialCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function readInitialTocExpanded(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(TOC_STORAGE_KEY) !== "0";
  } catch {
    return true;
  }
}

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(readInitialCollapsed);
  const [tocExpanded, setTocExpanded] = useState<boolean>(readInitialTocExpanded);
  const asideRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      // Ignore storage write errors.
    }
  }, [collapsed]);

  useEffect(() => {
    try {
      window.localStorage.setItem(TOC_STORAGE_KEY, tocExpanded ? "1" : "0");
    } catch {
      // Ignore storage write errors.
    }
  }, [tocExpanded]);

  useLayoutEffect(() => {
    const el = asideRef.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const prev = parent.style.display;
    parent.style.display = "none";
    void parent.offsetHeight;
    parent.style.display = prev || "flex";
  }, [collapsed]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "\\") {
        e.preventDefault();
        setCollapsed((c) => !c);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <aside
      ref={asideRef}
      data-collapsed={collapsed}
      style={{
        width: collapsed ? 60 : 232,
        transition: "width 220ms cubic-bezier(0.2, 0, 0, 1)",
      }}
      className="group/sidebar sticky top-0 z-40 flex h-dvh shrink-0 flex-col overflow-hidden border-r border-white/5 bg-surface-inset"
      aria-label="Primary"
    >
      <SidebarHeader
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {!collapsed && (
          <p className="mb-1.5 px-2 font-mono text-[9px] tracking-[0.22em] text-white/35 uppercase">
            Workspace
          </p>
        )}
        <ul className="flex flex-col gap-0.5">
          {primaryNav.map((item) => {
            const isActive = pathname === item.href;
            const isDashboard = item.href === "/dashboard";
            const showToc = isDashboard && isActive && !collapsed && tocExpanded;
            return (
              <li key={item.href} className="flex flex-col">
                {isDashboard && !collapsed ? (
                  <DashboardRow
                    item={item}
                    active={isActive}
                    expanded={tocExpanded}
                    onToggle={() => setTocExpanded((v) => !v)}
                  />
                ) : (
                  <SidebarItem
                    item={item}
                    collapsed={collapsed}
                    active={isActive}
                  />
                )}
                {showToc && <SidebarToc />}
              </li>
            );
          })}
        </ul>

        <div className="my-3 h-px bg-white/5" />

        {!collapsed && (
          <p className="mb-1.5 px-2 font-mono text-[9px] tracking-[0.22em] text-white/35 uppercase">
            System
          </p>
        )}
        <ul className="flex flex-col gap-0.5">
          {secondaryNav.map((item) => (
            <li key={item.href}>
              <SidebarItem
                item={item}
                collapsed={collapsed}
                active={pathname === item.href}
              />
            </li>
          ))}
        </ul>
      </nav>

      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
}

function SidebarHeader({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  if (collapsed) {
    return (
      <div className="flex shrink-0 flex-col items-center gap-2 border-b border-white/5 px-2 pt-3 pb-2.5">
        <Link
          href="/dashboard"
          className="flex size-9 items-center justify-center rounded-md bg-white text-surface-base transition hover:bg-white/90"
          aria-label="BRICKS home"
        >
          <span className="text-sm font-black">B</span>
        </Link>
        <button
          type="button"
          onClick={onToggle}
          aria-label="Expand sidebar"
          title="Expand sidebar (⌘\)"
          className="flex size-7 items-center justify-center rounded-md text-white/50 transition hover:bg-white/5 hover:text-white"
        >
          <PanelLeftOpenIcon className="size-4" strokeWidth={1.75} />
        </button>
      </div>
    );
  }
  return (
    <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-white/5 px-3">
      <Link
        href="/dashboard"
        className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white text-surface-base transition hover:bg-white/90"
        aria-label="BRICKS home"
      >
        <span className="text-sm font-black">B</span>
      </Link>
      <div className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="truncate text-[12px] font-semibold tracking-[0.25em] text-white">
          BRICKS
        </span>
        <span className="truncate font-mono text-[9px] tracking-[0.22em] text-white/45 uppercase">
          SLC · Collective
        </span>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-label="Collapse sidebar"
        title="Collapse sidebar (⌘\)"
        className="flex size-7 shrink-0 items-center justify-center rounded-md text-white/45 transition hover:bg-white/5 hover:text-white"
      >
        <PanelLeftCloseIcon className="size-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}

function SidebarItem({
  item,
  collapsed,
  active,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
}) {
  const Icon = item.icon;
  const base =
    "relative flex h-9 items-center gap-3 rounded-md px-2.5 text-[13px] transition";
  const state = active
    ? "bg-white/10 text-white"
    : item.disabled
      ? "text-white/35 hover:bg-white/[0.03] hover:text-white/55 cursor-not-allowed"
      : "text-white/65 hover:bg-white/5 hover:text-white";

  const content = (
    <>
      {active && (
        <span
          aria-hidden
          className="absolute top-1.5 bottom-1.5 left-0 w-[2px] rounded-r bg-glow"
        />
      )}
      <Icon className="size-4 shrink-0" strokeWidth={1.75} />
      {!collapsed && (
        <>
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          {item.disabled ? (
            <span className="font-mono text-[9px] tracking-wider text-white/30 uppercase">
              soon
            </span>
          ) : (
            item.badge && (
              <span className="rounded-[4px] bg-white/10 px-1.5 py-px font-mono text-[9px] tracking-wider text-white/70">
                {item.badge}
              </span>
            )
          )}
        </>
      )}
    </>
  );

  return item.disabled ? (
    <div
      className={`${base} ${state}`}
      aria-disabled
      title={collapsed ? `${item.label} (soon)` : undefined}
    >
      {content}
    </div>
  ) : (
    <Link
      href={item.href}
      className={`${base} ${state}`}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.label : undefined}
    >
      {content}
    </Link>
  );
}

function DashboardRow({
  item,
  active,
  expanded,
  onToggle,
}: {
  item: NavItem;
  active: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const Icon = item.icon;
  const base =
    "relative flex h-9 items-center gap-3 rounded-md px-2.5 text-[13px] transition";
  const state = active
    ? "bg-white/10 text-white"
    : "text-white/65 hover:bg-white/5 hover:text-white";

  return (
    <div className={`${base} ${state} pr-1`}>
      {active && (
        <span
          aria-hidden
          className="absolute top-1.5 bottom-1.5 left-0 w-[2px] rounded-r bg-glow"
        />
      )}
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <Icon className="size-4 shrink-0" strokeWidth={1.75} />
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
      </Link>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-label={expanded ? "Collapse sections" : "Expand sections"}
        className="flex size-6 shrink-0 items-center justify-center rounded text-white/40 transition hover:bg-white/5 hover:text-white"
      >
        <ChevronDownIcon
          className={[
            "size-3.5 transition-transform",
            expanded ? "rotate-0" : "-rotate-90",
          ].join(" ")}
          strokeWidth={2}
        />
      </button>
    </div>
  );
}

function SidebarToc() {
  const activeId = useActiveSection();

  function onClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: "smooth" });
    if (history.replaceState) history.replaceState(null, "", `#${id}`);
  }

  return (
    <ul className="mt-0.5 mb-1 ml-[18px] flex flex-col border-l border-white/[0.06] pl-2">
      {navSections.map((s) => {
        const active = s.id === activeId;
        return (
          <li key={s.id} className="relative">
            {active && (
              <span
                aria-hidden
                className="absolute top-1/2 -left-[9px] h-4 w-[2px] -translate-y-1/2 rounded-r bg-glow"
              />
            )}
            <a
              href={`#${s.id}`}
              onClick={(e) => onClick(e, s.id)}
              className={[
                "flex items-center gap-2 rounded-md px-2 py-1 text-[11px] transition",
                active
                  ? "text-white"
                  : "text-white/45 hover:text-white/80",
              ].join(" ")}
            >
              <span
                className={[
                  "font-mono text-[9px] tracking-wider tabular-nums",
                  active ? "text-glow" : "text-white/30",
                ].join(" ")}
              >
                {s.number}
              </span>
              <span className="truncate">{s.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return (
      <div
        className="flex shrink-0 items-center justify-center border-t border-white/5 px-2 py-3"
        title="Powered by Elios"
      >
        <span className="size-1.5 rounded-full bg-glow shadow-[0_0_6px_var(--glow)]" />
      </div>
    );
  }
  return (
    <div className="flex shrink-0 items-center gap-2 border-t border-white/5 px-3 py-3">
      <span className="size-1.5 shrink-0 rounded-full bg-glow shadow-[0_0_6px_var(--glow)]" />
      <span className="font-mono text-[9px] tracking-[0.22em] text-white/55 uppercase">
        Powered by Elios
      </span>
    </div>
  );
}
