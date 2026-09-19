"use client";

import { Bookmark, BookmarkCheck, CheckCircle2, Circle, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/Button";
import { useWatchlist } from "@/hooks/useWatchlist";
import { cn } from "@/lib/utils/cn";

export function AnimeActions({
  id,
  title,
  image,
  score,
  type,
  hasTrailer,
}: {
  id: number;
  title: string;
  image: string;
  score: number | null;
  type: string | null;
  hasTrailer: boolean;
}) {
  const { hydrated, has, entries, add, remove, toggleWatched } = useWatchlist();
  const inWatchlist = hydrated && has(id);
  const entry = entries.find((item) => item.id === id);
  const watched = entry?.watched ?? false;

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant={inWatchlist ? "secondary" : "primary"}
        onClick={() => (inWatchlist ? remove(id) : add({ id, title, image, score, type }))}
        aria-pressed={inWatchlist}
      >
        {inWatchlist ? (
          <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Bookmark className="h-4 w-4" aria-hidden="true" />
        )}
        {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
      </Button>

      {hasTrailer ? (
        <Link
          href={`/watch/${id}`}
          className={cn(
            "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-transparent px-5 text-sm font-medium text-foreground transition-all hover:bg-surface-hover",
          )}
        >
          <Play className="h-4 w-4" aria-hidden="true" />
          Watch Trailer
        </Link>
      ) : null}

      {inWatchlist ? (
        <Button variant="outline" onClick={() => toggleWatched(id)} aria-pressed={watched}>
          {watched ? (
            <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />
          ) : (
            <Circle className="h-4 w-4" aria-hidden="true" />
          )}
          {watched ? "Watched" : "Mark as Watched"}
        </Button>
      ) : null}
    </div>
  );
}
