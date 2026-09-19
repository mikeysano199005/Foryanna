import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Star, TrendingUp, Users, Clapperboard, Clock, Calendar, Radio } from "lucide-react";
import { SafeImage } from "@/components/SafeImage";
import { AnimeActions } from "@/components/AnimeActions";
import { AnimeCarousel } from "@/components/AnimeCarousel";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { CharacterGrid } from "@/components/anime-details/CharacterGrid";
import { StaffGrid } from "@/components/anime-details/StaffGrid";
import { RelatedAnimeList } from "@/components/anime-details/RelatedAnimeList";
import {
  JikanApiError,
  getAnimeById,
  getAnimeCharacters,
  getAnimeRecommendations,
  getAnimeStaff,
} from "@/lib/api/jikan";
import { toCardData, type AnimeFull } from "@/lib/types/anime";
import { formatCompactNumber, formatDate, formatEpisodes, formatScore } from "@/lib/utils/format";
import { ErrorState } from "@/components/ui/ErrorState";

export const revalidate = 3600;

async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

type LoadResult =
  | { status: "ok"; anime: AnimeFull }
  | { status: "not_found" }
  | { status: "error" };

async function loadAnime(id: number): Promise<LoadResult> {
  try {
    const anime = await getAnimeById(id);
    return { status: "ok", anime };
  } catch (err) {
    if (err instanceof JikanApiError && err.status === 404) return { status: "not_found" };
    return { status: "error" };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await loadAnime(Number(id));
  if (result.status === "not_found") return { title: "Anime Not Found" };
  if (result.status === "error") return { title: "Anime" };
  const anime = result.anime;

  const description = anime.synopsis
    ? anime.synopsis.slice(0, 160).trim() + (anime.synopsis.length > 160 ? "…" : "")
    : `Explore ${anime.title} on ANIMORA.`;
  const image = anime.images?.jpg?.large_image_url;

  return {
    title: anime.title_english || anime.title,
    description,
    openGraph: {
      title: `${anime.title} — ANIMORA`,
      description,
      images: image ? [{ url: image }] : undefined,
      type: "video.tv_show",
    },
    twitter: {
      card: "summary_large_image",
      title: `${anime.title} — ANIMORA`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function AnimeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) notFound();

  const result = await loadAnime(id);
  if (result.status === "not_found") notFound();
  if (result.status === "error") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <ErrorState />
      </div>
    );
  }
  const anime = result.anime;

  const [characters, staff, recommendations] = await Promise.all([
    safe(getAnimeCharacters(id), []),
    safe(getAnimeStaff(id), []),
    safe(getAnimeRecommendations(id), []),
  ]);

  const image =
    anime.images?.webp?.large_image_url ||
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url ||
    "";

  const stats: { icon: typeof Star; label: string; value: string }[] = [
    { icon: Star, label: "Score", value: `${formatScore(anime.score)} (${formatCompactNumber(anime.scored_by)} votes)` },
    { icon: TrendingUp, label: "Rank", value: anime.rank ? `#${anime.rank}` : "N/A" },
    { icon: Users, label: "Popularity", value: anime.popularity ? `#${anime.popularity}` : "N/A" },
    { icon: Clapperboard, label: "Episodes", value: formatEpisodes(anime.episodes) },
    { icon: Clock, label: "Duration", value: anime.duration || "N/A" },
    { icon: Radio, label: "Status", value: anime.status || "N/A" },
    { icon: Calendar, label: "Aired", value: `${formatDate(anime.aired?.from)} – ${formatDate(anime.aired?.to)}` },
  ];

  return (
    <div className="pb-16">
      <div className="relative h-56 w-full overflow-hidden sm:h-80">
        <SafeImage src={image} alt="" fill priority sizes="100vw" className="object-cover object-top blur-sm scale-105 opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
      </div>

      <div className="mx-auto -mt-24 flex max-w-6xl flex-col gap-6 px-4 sm:-mt-32 sm:flex-row sm:px-6">
        <div className="relative aspect-[2/3] w-40 shrink-0 overflow-hidden rounded-2xl border-4 border-background shadow-xl sm:w-56">
          <SafeImage src={image} alt={anime.title} fill sizes="(max-width: 640px) 160px, 224px" className="object-cover" priority />
        </div>

        <div className="flex flex-1 flex-col gap-4 pt-2 sm:pt-8">
          <div>
            <h1 className="text-balance text-2xl font-extrabold text-foreground sm:text-4xl">
              {anime.title_english || anime.title}
            </h1>
            {anime.title_japanese ? (
              <p className="mt-1 text-sm font-medium text-muted">{anime.title_japanese}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {anime.type ? <Badge>{anime.type}</Badge> : null}
            {anime.year ? <Badge>{anime.year}</Badge> : null}
            {anime.genres.map((genre) => (
              <Badge key={genre.mal_id}>{genre.name}</Badge>
            ))}
            {anime.themes?.map((theme) => (
              <Badge key={theme.mal_id}>{theme.name}</Badge>
            ))}
            {anime.demographics?.map((demo) => (
              <Badge key={demo.mal_id}>{demo.name}</Badge>
            ))}
          </div>

          <AnimeActions
            id={anime.mal_id}
            title={anime.title}
            image={image}
            score={anime.score}
            type={anime.type}
            hasTrailer={Boolean(anime.trailer?.youtube_id)}
          />

          {anime.synopsis ? (
            <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-muted sm:text-[15px]">
              {anime.synopsis}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_280px]">
        <div className="order-2 lg:order-1">
          <Tabs
            items={[
              { id: "characters", label: "Characters", content: <CharacterGrid characters={characters} /> },
              { id: "staff", label: "Staff", content: <StaffGrid staff={staff} /> },
              {
                id: "related",
                label: "Related",
                content: <RelatedAnimeList relations={anime.relations} />,
              },
            ]}
          />
        </div>

        <aside className="order-1 flex flex-col gap-4 lg:order-2">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Details</h2>
            <dl className="flex flex-col gap-2.5">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between gap-2 text-sm">
                  <dt className="flex items-center gap-1.5 text-muted">
                    <stat.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {stat.label}
                  </dt>
                  <dd className="text-right font-medium text-foreground">{stat.value}</dd>
                </div>
              ))}
              {anime.season && anime.year ? (
                <div className="flex items-center justify-between gap-2 text-sm">
                  <dt className="text-muted">Season</dt>
                  <dd className="text-right font-medium capitalize text-foreground">
                    {anime.season} {anime.year}
                  </dd>
                </div>
              ) : null}
              {anime.studios && anime.studios.length > 0 ? (
                <div className="flex items-center justify-between gap-2 text-sm">
                  <dt className="text-muted">Studios</dt>
                  <dd className="text-right font-medium text-foreground">
                    {anime.studios.map((s) => s.name).join(", ")}
                  </dd>
                </div>
              ) : null}
              {anime.producers && anime.producers.length > 0 ? (
                <div className="flex items-center justify-between gap-2 text-sm">
                  <dt className="text-muted">Producers</dt>
                  <dd className="text-right font-medium text-foreground">
                    {anime.producers.map((p) => p.name).join(", ")}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </aside>
      </div>

      {recommendations.length > 0 ? (
        <div className="mt-10">
          <AnimeCarousel title="Recommendations" items={recommendations.map(toCardData)} />
        </div>
      ) : null}
    </div>
  );
}
