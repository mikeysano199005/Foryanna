import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about ANIMORA, a modern anime discovery platform.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">About ANIMORA</h1>
      <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-muted">
        <p>
          ANIMORA is an anime discovery platform built to help fans find their next favorite
          series. Browse trending and seasonal anime, dig into genres, and keep a personal
          watchlist — all in one clean, fast interface.
        </p>
        <p>
          All anime metadata, artwork and trailer links are sourced from the{" "}
          <a
            href="https://jikan.moe"
            target="_blank"
            rel="noreferrer noopener"
            className="text-accent hover:underline"
          >
            Jikan API
          </a>
          , an unofficial REST API for MyAnimeList. ANIMORA does not host, stream, or distribute
          any copyrighted anime episodes — trailer playback uses officially published sources
          only.
        </p>
        <p>
          ANIMORA is an independent project and is not affiliated with or endorsed by
          MyAnimeList, Crunchyroll, or any anime studio or publisher.
        </p>
      </div>
    </div>
  );
}
