import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAnimeByGenre, getAnimeGenres } from "@/lib/api/jikan";
import { toCardData } from "@/lib/types/anime";
import { AnimeGrid } from "@/components/AnimeGrid";
import { Pagination } from "@/components/Pagination";
import { ErrorState } from "@/components/ui/ErrorState";
import { capitalize, slugifyGenre } from "@/lib/utils/format";

export const revalidate = 1800;

interface GenrePageParams {
  genre: string;
}

interface GenrePageSearchParams {
  id?: string;
  page?: string;
}

function findGenre(genres: Awaited<ReturnType<typeof getAnimeGenres>>, slug: string, idHint?: string) {
  const byId = idHint ? genres.find((g) => String(g.mal_id) === idHint) : undefined;
  if (byId) return byId;
  return genres.find((g) => slugifyGenre(g.name) === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<GenrePageParams>;
}): Promise<Metadata> {
  const { genre } = await params;
  const name = capitalize(genre.replace(/-/g, " "));
  return {
    title: `${name} Anime`,
    description: `Browse the best ${name} anime on ANIMORA.`,
  };
}

export default async function GenrePage({
  params,
  searchParams,
}: {
  params: Promise<GenrePageParams>;
  searchParams: Promise<GenrePageSearchParams>;
}) {
  const { genre: slug } = await params;
  const { id, page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;

  let genres;
  try {
    genres = await getAnimeGenres();
  } catch {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <ErrorState />
      </div>
    );
  }

  const genre = findGenre(genres, slug, id);
  if (!genre) notFound();

  let result;
  try {
    result = await getAnimeByGenre(genre.mal_id, page);
  } catch {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <ErrorState />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{genre.name} Anime</h1>
        <p className="mt-1 text-sm text-muted">{genre.count.toLocaleString()} titles</p>
      </div>
      <AnimeGrid items={result.data.map(toCardData)} />
      <Pagination
        currentPage={page}
        hasNextPage={result.hasNextPage}
        basePath={`/genres/${slug}`}
        searchParams={{ id: String(genre.mal_id) }}
      />
    </div>
  );
}
