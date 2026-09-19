# ANIMORA

A modern, mobile-first anime discovery platform. Browse trending, popular and
seasonal anime, explore genres, search the full catalog, watch official
trailers, and keep a personal watchlist and watch history.

## Features

- **Home** — cinematic featured hero, trending/popular/recently-updated/
  seasonal/top-rated carousels, and genre chips.
- **Browse & Search** — filterable, paginated anime catalog and a debounced
  search page with sorting (score, popularity, newest, alphabetical).
- **Anime details** — synopsis, score, rank, popularity, episodes, duration,
  status, air dates, studios, producers, genres/themes/demographics,
  characters, staff, related anime and recommendations.
- **Genres, Trending, Popular, Season** — dedicated browse pages, including a
  season/year picker that defaults to the current season.
- **Watchlist & History** — add/remove/mark-watched, stored in `localStorage`
  by default and structured so a Supabase-backed implementation can replace
  it later without touching call sites (see `src/lib/storage`).
- **Trailer player** (`/watch/[id]`) — custom controls (play/pause, volume,
  progress, fullscreen, keyboard shortcuts) over the anime's official,
  licensed YouTube trailer. Titles without one show a clear fallback instead
  of a broken player.
- **Auth-ready** — optional Supabase email/password auth. When it isn't
  configured, the app runs fully in a local-only mode instead of crashing.
- **Dark/light theme**, responsive from 320px phones to large desktops,
  skeleton loading states, graceful error/empty states, and SEO metadata
  (per-page Open Graph/Twitter tags, `robots.txt`, `sitemap.xml`).

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4
- [TanStack Query](https://tanstack.com/query) for client-side data fetching
- [Framer Motion](https://www.framer.com/motion/) for animation
- [Lucide React](https://lucide.dev) icons
- [Jikan API](https://jikan.moe) (unofficial MyAnimeList REST API) for all
  anime metadata, artwork and trailer links
- Optional [Supabase](https://supabase.com) for authentication

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you need:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL used for SEO metadata, `sitemap.xml` and `robots.txt`. Defaults to a placeholder. |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase project URL. Leave unset to run in local-only mode (watchlist/history in `localStorage`, login/register disabled with a clear message). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Supabase anonymous/public API key. |

No API key is required for anime data — the Jikan API is free and public.

## Scripts

```bash
npm run dev     # start the dev server
npm run build   # production build
npm run start   # run the production build
npm run lint    # ESLint
```

## Deployment

The app is Vercel-ready out of the box:

1. Push the repository to GitHub.
2. Import it into [Vercel](https://vercel.com/new).
3. Add the environment variables above if you want a custom site URL or
   Supabase auth.
4. Deploy — no extra configuration needed.

## API & legal notes

- All anime metadata and artwork come from the [Jikan API](https://jikan.moe),
  an unofficial MyAnimeList REST API. Jikan is rate-limited (~3 req/s,
  60 req/min); the API layer in `src/lib/api/jikan.ts` retries with backoff
  on `429` responses and every page degrades to a friendly error/empty state
  instead of crashing if the API is unreachable.
- ANIMORA does **not** host, stream, or link to pirated anime episodes.
  `/watch/[id]` only ever embeds a title's official YouTube trailer (when
  Jikan reports one); titles without one show "No official video is
  currently available" instead.
- ANIMORA is an independent project and is not affiliated with or endorsed
  by MyAnimeList, Crunchyroll, or any anime studio or publisher.

## Project structure

```
src/
  app/            # routes (App Router)
  components/      # reusable UI (cards, carousels, header/nav/footer, ui/)
  context/         # Theme, Auth and React Query providers
  hooks/           # useWatchlist, useHistory, useDebounce, ...
  lib/
    api/jikan.ts   # typed Jikan API client
    types/anime.ts # Jikan/domain TypeScript types
    storage/       # localStorage-backed watchlist & history (Supabase-ready)
    supabase/      # optional Supabase browser client
    utils/         # formatting & class-name helpers
```
