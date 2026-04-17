"use client";

import { DownloadIcon, LinkIcon, MaximizeIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  kicker?: React.ReactNode;
  children: React.ReactNode;
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  kicker,
  children,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyAnchor = async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy anchor link", error);
    }
  };

  const handleDownload = () => {
    console.log(`[section:${id}] download section data — coming soon`);
  };

  const handleExpand = () => {
    console.log(`[section:${id}] expand / focus section — coming soon`);
  };

  const actionButtonClass =
    "inline-flex size-7 items-center justify-center rounded-md border border-white/5 bg-white/[0.02] text-white/45 transition-colors hover:border-white/15 hover:bg-white/10 hover:text-white/90";

  return (
    <section id={id} className="scroll-mt-20 flex flex-col gap-6">
      <div className="flex flex-col gap-3 border-b border-white/5 pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.28em] text-white/40 uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-white">
            {title}
          </h2>
          {description && (
            <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-white/50">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 sm:flex-row-reverse">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleCopyAnchor}
              title={copied ? "Copied" : "Copy link to section"}
              aria-label="Copy link to section"
              className={actionButtonClass}
            >
              <LinkIcon className="size-3.5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              title="Download section data · Coming soon"
              aria-label="Download section data"
              className={actionButtonClass}
            >
              <DownloadIcon className="size-3.5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={handleExpand}
              title="Expand section · Coming soon"
              aria-label="Expand section"
              className={actionButtonClass}
            >
              <MaximizeIcon className="size-3.5" strokeWidth={1.75} />
            </button>
          </div>
          {kicker}
        </div>
      </div>
      {children}
    </section>
  );
}
