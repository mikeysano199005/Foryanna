import type { Metadata } from "next";
import { getAnimeGenres } from "@/lib/api/jikan";
import { GenreCard } from "@/components/GenreCard";
import { ErrorState } from "@/components/ui/ErrorState";

export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Genres",
  description: "Browse anime by genre — Action, Adventure, Comedy, Drama, Fantasy, Romance, Sci-Fi and more on ANIMORA.",
};

export default async function GenresPage() {
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

  const sorted = genres
    .filter((genre) => genre.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Genres</h1>
        <p className="mt-1 text-sm text-muted">Explore anime across every genre and theme.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {sorted.map((genre, i) => (
          <GenreCard key={genre.mal_id} id={genre.mal_id} name={genre.name} count={genre.count} index={i} />
        ))}
      </div>
    </div>
  );
}
