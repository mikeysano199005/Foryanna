import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://animora.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ANIMORA — Discover Your Next Anime",
    template: "%s — ANIMORA",
  },
  description:
    "ANIMORA is a modern anime discovery platform. Browse trending, popular and seasonal anime, explore genres, and build your watchlist.",
  keywords: ["anime", "anime discovery", "watchlist", "MyAnimeList", "seasonal anime", "trending anime"],
  openGraph: {
    type: "website",
    siteName: "ANIMORA",
    title: "ANIMORA — Discover Your Next Anime",
    description:
      "Browse trending, popular and seasonal anime, explore genres, and build your watchlist.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ANIMORA — Discover Your Next Anime",
    description:
      "Browse trending, popular and seasonal anime, explore genres, and build your watchlist.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const THEME_INIT_SCRIPT = `
try {
  var stored = localStorage.getItem('animora:theme');
  var theme = stored === 'light' ? 'light' : 'dark';
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme;
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} dark`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased" suppressHydrationWarning>
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="flex-1 pb-20 lg:pb-0">
            {children}
          </main>
          <Footer />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
