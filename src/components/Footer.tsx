import Link from "next/link";
import { Logo } from "./Logo";

const FOOTER_LINKS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { href: "/anime", label: "Browse Anime" },
      { href: "/genres", label: "Genres" },
      { href: "/trending", label: "Trending" },
      { href: "/season", label: "Current Season" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface/50 pb-24 lg:pb-8">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="max-w-xs text-sm text-muted">
              Discover anime, track your watchlist, and explore seasons, genres and trends — all
              in one place.
            </p>
          </div>
          {FOOTER_LINKS.map((group) => (
            <div key={group.title} className="flex flex-col gap-2.5">
              <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-sm font-semibold text-foreground">API Attribution</h3>
            <p className="text-sm text-muted">
              Anime data and images provided by the{" "}
              <a
                href="https://jikan.moe"
                target="_blank"
                rel="noreferrer noopener"
                className="text-accent hover:underline"
              >
                Jikan API
              </a>
              , an unofficial MyAnimeList API.
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row">
          <p>&copy; {new Date().getFullYear()} ANIMORA. All rights reserved.</p>
          <p>Anime metadata via Jikan / MyAnimeList. Trailers are official, licensed sources only.</p>
        </div>
      </div>
    </footer>
  );
}
