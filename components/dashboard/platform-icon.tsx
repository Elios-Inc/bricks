import type { PlatformKey } from "@/lib/dashboard/data";

type Props = {
  platform: PlatformKey;
  className?: string;
};

export function PlatformIcon({ platform, className = "size-4" }: Props) {
  switch (platform) {
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#FF0000">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#00F2EA">
          <path d="M19.6 6.7a5.4 5.4 0 0 1-3.2-1v7.9a6.1 6.1 0 1 1-5.3-6v3.2a2.9 2.9 0 1 0 2 2.8V2h3.1a5.4 5.4 0 0 0 3.4 4.7v0z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <defs>
            <linearGradient id="ig-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F58529" />
              <stop offset="50%" stopColor="#DD2A7B" />
              <stop offset="100%" stopColor="#8134AF" />
            </linearGradient>
          </defs>
          <path
            fill="url(#ig-grad)"
            d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.3 2.3.4.6.2 1 .5 1.5 1 .5.5.8.9 1 1.5.1.5.3 1.1.4 2.3.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.8-.4 2.3-.2.6-.5 1-1 1.5-.5.5-.9.8-1.5 1-.5.1-1.1.3-2.3.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.3-2.3-.4a4 4 0 0 1-1.5-1 4 4 0 0 1-1-1.5c-.1-.5-.3-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.3-1.8.4-2.3.2-.6.5-1 1-1.5.5-.5.9-.8 1.5-1 .5-.1 1.1-.3 2.3-.4C8.4 2.2 8.8 2.2 12 2.2zm0 5.3a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm5.8-.3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 9.3a2.7 2.7 0 1 1 0 5.4 2.7 2.7 0 0 1 0-5.4z"
          />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#1877F2">
          <path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4h-3V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2V8h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.6 3.5h-2.9v8.4A12 12 0 0 0 24 12z" />
        </svg>
      );
  }
}
