import type { Metadata } from "next";
import { Suspense } from "react";
import { searchAnime } from "@/lib/api/jikan";
import { toCardData } from "@/lib/types/anime";
import type { AnimeOrderBy, SortDirection, AnimeStatus } from "@/lib/types/anime";
import { AnimeGrid } from "@/components/AnimeGrid";
import { FilterBar } from "@/components/FilterBar";
import { Pagination } from "@/components/Pagination";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageSkeleton } from "@/components/Skeletons/PageSkeleton";

export const metadata: Metadata = {
  title: "Browse Anime",
  description: "Browse the full anime catalog on ANIMORA. Filter by status, type and sort by popularity, score or release date.",
};

interface AnimePageSearchParams {
  page?: string;
  order_by?: string;
  sort?: string;
  status?: string;
  type?: string;
}

export default async function AnimeBrowsePage({
  searchParams,
}: {
  searchParams: Promise<AnimePageSearchParams>;
}) {
  const params = await searchParams;
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AnimeBrowseContent params={params} />
    </Suspense>
  );
}

async function AnimeBrowseContent({ params }: { params: AnimePageSearchParams }) {
  const page = Number(params.page) || 1;
  const orderBy = (params.order_by as AnimeOrderBy) || "popularity";
  const sort = (params.sort as SortDirection) || "asc";

  let result;
  try {
    result = await searchAnime({
      page,
      order_by: orderBy,
      sort,
      status: params.status as AnimeStatus | undefined,
      type: params.type,
    });
  } catch {
    return <ErrorState />;
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Browse Anime</h1>
        <FilterBar />
      </div>
      <AnimeGrid items={result.data.map(toCardData)} />
      <Pagination
        currentPage={page}
        hasNextPage={result.hasNextPage}
        basePath="/anime"
        searchParams={{
          order_by: params.order_by,
          sort: params.sort,
          status: params.status,
          type: params.type,
        }}
      />
    </div>
  );
}
