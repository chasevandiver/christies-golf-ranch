import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#2A4430",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://christiesgolfranch.com"),
  title: "Christie's Golf Ranch — All-Grass Driving Range & Par-3 in Pilot Point, TX",
  description:
    "An all-grass driving range and 9-hole par-3 course on 15 acres of Pilot Point horse country. Lessons with Jeff, memberships, junior camps, and a monthly Play Day. Open every day.",
  openGraph: {
    title: "Christie's Golf Ranch",
    description:
      "All-grass driving range & 9-hole par-3 course in Pilot Point, Texas. Open every day.",
    type: "website",
    url: "https://christiesgolfranch.com/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,500;0,600;0,700;0,800;1,500&family=Mulish:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
