"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchBar } from "./SearchBar";
import { AnimeGrid } from "./AnimeGrid";
import { Pagination } from "./Pagination";
import { FilterBar } from "./FilterBar";
import { ErrorState } from "./ui/ErrorState";
import { EmptyState } from "./ui/EmptyState";
import { SearchSkeleton } from "./Skeletons/SearchSkeleton";
import { searchAnime } from "@/lib/api/jikan";
import { toCardData, type AnimeOrderBy, type SortDirection } from "@/lib/types/anime";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchX } from "lucide-react";

export function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";
  const [input, setInput] = useState(initialQuery);
  // Resync the input if the URL's `q` changes from outside this component
  // (back/forward navigation) — adjusted during render, per React's guidance
  // for deriving state from a changed prop instead of mirroring it in an effect.
  const [trackedQuery, setTrackedQuery] = useState(initialQuery);
  if (initialQuery !== trackedQuery) {
    setTrackedQuery(initialQuery);
    setInput(initialQuery);
  }
  const debouncedInput = useDebounce(input, 400);

  const page = Number(searchParams.get("page")) || 1;
  const orderBy = (searchParams.get("order_by") as AnimeOrderBy) || "popularity";
  const sort = (searchParams.get("sort") as SortDirection) || "asc";

  useEffect(() => {
    const trimmed = debouncedInput.trim();
    const currentQ = searchParams.get("q") ?? "";
    if (trimmed === currentQ) return;
    const params = new URLSearchParams(searchParams.toString());
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
    params.delete("page");
    router.replace(`/search?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput]);

  const query = searchParams.get("q") ?? "";

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["search", query, page, orderBy, sort],
    queryFn: () => searchAnime({ q: query, page, order_by: orderBy, sort }),
    enabled: query.trim().length > 0,
  });

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Search Anime</h1>
      <div className="flex flex-col gap-4">
        <SearchBar value={input} onChange={setInput} className="max-w-xl" />
        <FilterBar showStatus={false} showType={false} />
      </div>

      {!query.trim() ? (
        <EmptyState
          icon={SearchX}
          title="Start typing to search"
          description="Search thousands of anime titles by name."
        />
      ) : isLoading || isFetching ? (
        <SearchSkeleton />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <>
          <p className="text-sm text-muted">
            Showing results for <span className="font-semibold text-foreground">&ldquo;{query}&rdquo;</span>
          </p>
          <AnimeGrid
            items={(data?.data ?? []).map(toCardData)}
            emptyTitle="No anime found."
            emptyDescription="Try a different title or check your spelling."
          />
          {data && data.data.length > 0 ? (
            <Pagination
              currentPage={page}
              hasNextPage={data.hasNextPage}
              basePath="/search"
              searchParams={{ q: query, order_by: orderBy, sort }}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
