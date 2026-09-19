import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/Hero";
import { AnimeCarousel } from "@/components/AnimeCarousel";
import { GenreCard } from "@/components/GenreCard";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  getAnimeGenres,
  getCurrentSeason,
  getPopularAnime,
  getRecentEpisodes,
  getSeasonNow,
  getTopRatedAnime,
  getTrendingAnime,
} from "@/lib/api/jikan";
import { toCardData, type AnimeCardData, type AnimeSummary } from "@/lib/types/anime";
import { capitalize } from "@/lib/utils/format";

export const revalidate = 1800;

async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const [trending, popular, season, recent, topRated, genres] = await Promise.all([
    safe(getTrendingAnime(1, 16), { data: [] as AnimeSummary[], hasNextPage: false, lastPage: 1 }),
    safe(getPopularAnime(1, 16), { data: [] as AnimeSummary[], hasNextPage: false, lastPage: 1 }),
    safe(getSeasonNow(1, 16), { data: [] as AnimeSummary[], hasNextPage: false, lastPage: 1 }),
    safe(getRecentEpisodes(1), { data: [], hasNextPage: false, lastPage: 1 }),
    safe(getTopRatedAnime(1, 12), { data: [] as AnimeSummary[], hasNextPage: false, lastPage: 1 }),
    safe(getAnimeGenres(), []),
  ]);

  const heroItems = (trending.data.length ? trending.data : season.data)
    .filter((anime) => anime.images?.jpg?.large_image_url)
    .slice(0, 5);

  const recentCards: AnimeCardData[] = recent.data.map((item) => ({
    id: item.entry.mal_id,
    title: item.entry.title,
    titleEnglish: null,
    image:
      item.entry.images?.webp?.large_image_url ||
      item.entry.images?.jpg?.large_image_url ||
      "",
    score: null,
    year: null,
    type: null,
    episodes: item.episodes.length,
    rank: null,
    status: null,
  }));

  const { season: currentSeasonName, year } = getCurrentSeason();
  const featuredGenres = genres
    .slice()
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="flex flex-col gap-14 pb-16">
      <div className="px-0 pt-0 sm:px-6 sm:pt-6">
        {heroItems.length > 0 ? (
          <Hero items={heroItems} />
        ) : (
          <div className="px-4 sm:px-0">
            <EmptyState
              title="Anime information is temporarily unavailable."
              description="We couldn't reach the anime database right now. Please refresh in a moment."
            />
          </div>
        )}
      </div>

      <AnimeCarousel
        title="Trending Now"
        items={trending.data.map((a, i) => ({ ...toCardData(a), rank: i + 1 }))}
        viewAllHref="/trending"
      />

      <AnimeCarousel
        title="Popular Anime"
        items={popular.data.map((a) => toCardData(a))}
        viewAllHref="/popular"
      />

      {recentCards.length > 0 ? (
        <AnimeCarousel title="Recently Updated" items={recentCards} />
      ) : null}

      <AnimeCarousel
        title={`${capitalize(currentSeasonName)} ${year} Season`}
        items={season.data.map((a) => toCardData(a))}
        viewAllHref="/season"
      />

      <AnimeCarousel
        title="Top Rated"
        items={topRated.data.map((a, i) => ({ ...toCardData(a), rank: i + 1 }))}
        viewAllHref="/anime?order_by=score&sort=desc"
      />

      {featuredGenres.length > 0 ? (
        <section className="flex flex-col gap-3 px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground sm:text-xl">Browse by Genre</h2>
            <Link
              href="/genres"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              All genres <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {featuredGenres.map((genre, i) => (
              <GenreCard key={genre.mal_id} id={genre.mal_id} name={genre.name} count={genre.count} index={i} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
