import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Cinzel, Cormorant_Garamond, Great_Vibes } from "next/font/google";
import { WorldShell } from "@/components/world-shell";
import { GAME } from "@/content/game";
import "./globals.css";
import "./mobile.css";
import "./boot.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: GAME.title,
  description: GAME.tagline,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: GAME.title,
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1430",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Suspense fallback={<div className="min-h-dvh bg-[#fff7f5]" />}>
          <WorldShell>{children}</WorldShell>
        </Suspense>
      </body>
    </html>
  );
}
