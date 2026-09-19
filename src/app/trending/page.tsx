import type { Metadata } from "next";
import Link from "next/link";
import { Flame, Star } from "lucide-react";
import { getTrendingAnime } from "@/lib/api/jikan";
import { toCardData } from "@/lib/types/anime";
import { SafeImage } from "@/components/SafeImage";
import { AnimeGrid } from "@/components/AnimeGrid";
import { Pagination } from "@/components/Pagination";
import { ErrorState } from "@/components/ui/ErrorState";
import { formatEpisodes, formatScore } from "@/lib/utils/format";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Trending Anime",
  description: "See what's trending right now — the most talked-about currently airing anime.",
};

export default async function TrendingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;

  let result;
  try {
    result = await getTrendingAnime(page, 24);
  } catch {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <ErrorState />
      </div>
    );
  }

  const [featured, ...rest] = result.data;
  const featuredImage = featured
    ? featured.images?.webp?.large_image_url || featured.images?.jpg?.large_image_url || ""
    : "";

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6">
      <div className="flex items-center gap-2">
        <Flame className="h-6 w-6 text-crimson" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Trending Anime</h1>
      </div>

      {page === 1 && featured ? (
        <Link
          href={`/anime/${featured.mal_id}`}
          className="group relative flex h-64 w-full overflow-hidden rounded-2xl sm:h-80"
        >
          <SafeImage
            src={featuredImage}
            alt={featured.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 flex flex-col gap-2 p-6">
            <span className="w-fit rounded-full bg-crimson px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              #1 Trending
            </span>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">{featured.title}</h2>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                {formatScore(featured.score)}
              </span>
              <span>{formatEpisodes(featured.episodes)}</span>
            </div>
          </div>
        </Link>
      ) : null}

      <AnimeGrid
        items={(page === 1 ? rest : result.data).map((a, i) => ({
          ...toCardData(a),
          rank: page === 1 ? i + 2 : (page - 1) * 24 + i + 1,
        }))}
      />

      <Pagination currentPage={page} hasNextPage={result.hasNextPage} basePath="/trending" />
    </div>
  );
}
