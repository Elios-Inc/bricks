import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bricksslc.com"
  ),
  title: {
    default: "BRAND HOUSE | BRICKS",
    template: "%s | BRICKS",
  },
  description:
    "Dashboard for tracking social media performance across Instagram, TikTok, YouTube, and Facebook Reels.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [{ rel: "icon", url: "/icon-192.png", sizes: "192x192" }],
  },
  openGraph: {
    title: "BRAND HOUSE | BRICKS",
    description:
      "Dashboard for tracking social media performance across Instagram, TikTok, YouTube, and Facebook Reels.",
    siteName: "BRICKS",
    images: [
      {
        url: "/og-image.png",
        width: 2364,
        height: 1330,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BRAND HOUSE | BRICKS",
    description:
      "Dashboard for tracking social media performance across Instagram, TikTok, YouTube, and Facebook Reels.",
    images: ["/og-image.png"],
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
