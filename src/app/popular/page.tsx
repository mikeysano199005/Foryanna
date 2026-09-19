import type { Metadata } from "next";
import { TrendingUp } from "lucide-react";
import { getPopularAnime } from "@/lib/api/jikan";
import { toCardData } from "@/lib/types/anime";
import { AnimeGrid } from "@/components/AnimeGrid";
import { Pagination } from "@/components/Pagination";
import { ErrorState } from "@/components/ui/ErrorState";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Popular Anime",
  description: "The most popular anime of all time, ranked by community popularity.",
};

export default async function PopularPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;

  let result;
  try {
    result = await getPopularAnime(page, 24);
  } catch {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <ErrorState />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-accent" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Popular Anime</h1>
      </div>
      <AnimeGrid
        items={result.data.map((a, i) => ({ ...toCardData(a), rank: (page - 1) * 24 + i + 1 }))}
      />
      <Pagination currentPage={page} hasNextPage={result.hasNextPage} basePath="/popular" />
    </div>
  );
}
