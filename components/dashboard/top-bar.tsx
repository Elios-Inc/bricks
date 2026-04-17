import { ChevronDownIcon } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0D0D0D]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-white text-[#0D0D0D]">
            <span className="text-sm font-black">B</span>
          </div>
          <span className="text-sm font-semibold tracking-[0.2em] text-white">
            BRICKS SLC
          </span>
        </div>

        <h1 className="text-sm font-medium text-white/80">
          Analytics Dashboard
        </h1>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/10"
          >
            Last 30 Days
            <ChevronDownIcon className="size-3.5" />
          </button>
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <span className="size-1.5 rounded-full bg-[#00C853]" />
            <span className="text-[10px] font-medium tracking-wider text-white/60 uppercase">
              Powered by Elios
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
