import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentSeason, getSeasonAnime } from "@/lib/api/jikan";
import { toCardData } from "@/lib/types/anime";
import type { AnimeSeason } from "@/lib/types/anime";
import { AnimeGrid } from "@/components/AnimeGrid";
import { Pagination } from "@/components/Pagination";
import { ErrorState } from "@/components/ui/ErrorState";
import { capitalize } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Seasonal Anime",
  description: "Browse anime by season — Winter, Spring, Summer and Fall, for any year.",
};

const SEASONS: AnimeSeason[] = ["winter", "spring", "summer", "fall"];

export default async function SeasonPage({
  searchParams,
}: {
  searchParams: Promise<{ season?: string; year?: string; page?: string }>;
}) {
  const params = await searchParams;
  const current = getCurrentSeason();
  const season = (SEASONS.includes(params.season as AnimeSeason) ? params.season : current.season) as AnimeSeason;
  const year = Number(params.year) || current.year;
  const page = Number(params.page) || 1;

  let result;
  try {
    result = await getSeasonAnime(year, season, page, 24);
  } catch {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <ErrorState />
      </div>
    );
  }

  const years = Array.from({ length: 12 }, (_, i) => current.year + 1 - i);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          {capitalize(season)} {year} Anime
        </h1>
        <p className="mt-1 text-sm text-muted">Browse anime by season and year.</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {SEASONS.map((s) => (
            <Link
              key={s}
              href={`/season?season=${s}&year=${year}`}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium capitalize transition-colors",
                s === season
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted hover:text-foreground",
              )}
            >
              {s}
            </Link>
          ))}
        </div>
        <div className="scrollbar-none flex gap-2 overflow-x-auto">
          {years.map((y) => (
            <Link
              key={y}
              href={`/season?season=${season}&year=${y}`}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                y === year
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted hover:text-foreground",
              )}
            >
              {y}
            </Link>
          ))}
        </div>
      </div>

      <AnimeGrid items={result.data.map(toCardData)} />
      <Pagination
        currentPage={page}
        hasNextPage={result.hasNextPage}
        basePath="/season"
        searchParams={{ season, year: String(year) }}
      />
    </div>
  );
}
