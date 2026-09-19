import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info, VideoOff } from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { WatchHistoryRecorder } from "@/components/WatchHistoryRecorder";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { JikanApiError, getAnimeById } from "@/lib/api/jikan";
import type { AnimeFull } from "@/lib/types/anime";

export const revalidate = 3600;

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
  if (result.status === "not_found") return { title: "Trailer Not Found" };
  if (result.status === "error") return { title: "Watch Trailer" };
  return {
    title: `Watch ${result.anime.title} Trailer`,
    description: `Watch the official trailer for ${result.anime.title} on ANIMORA.`,
  };
}

export default async function WatchPage({
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

  const image =
    anime.images?.webp?.large_image_url ||
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url ||
    "";
  const youtubeId = anime.trailer?.youtube_id;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{anime.title}</h1>
        <p className="mt-1 text-sm text-muted">Official trailer</p>
      </div>

      {youtubeId ? (
        <>
          <WatchHistoryRecorder id={anime.mal_id} title={anime.title} image={image} />
          <VideoPlayer youtubeId={youtubeId} title={anime.title} />
        </>
      ) : (
        <EmptyState
          icon={VideoOff}
          title="No official video is currently available."
          description="ANIMORA only links to official, licensed trailers. This title doesn't have one listed yet."
          action={
            <Link
              href={`/anime/${anime.mal_id}`}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-white hover:bg-accent-strong"
            >
              <Info className="h-4 w-4" aria-hidden="true" />
              View Anime Details
            </Link>
          }
        />
      )}
    </div>
  );
}
