"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import { SafeImage } from "./SafeImage";
import { formatScore } from "@/lib/utils/format";
import type { WatchlistEntry } from "@/lib/storage/types";

export function WatchlistCard({
  entry,
  onRemove,
  onToggleWatched,
}: {
  entry: WatchlistEntry;
  onRemove: (id: number) => void;
  onToggleWatched: (id: number) => void;
}) {
  return (
    <div className="group relative flex flex-col gap-2">
      <Link href={`/anime/${entry.id}`} className="relative block aspect-[2/3] overflow-hidden rounded-xl bg-surface-hover">
        <SafeImage
          src={entry.image}
          alt={entry.title}
          fill
          sizes="(max-width: 640px) 45vw, 200px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white">
          {formatScore(entry.score)}
        </span>
        {entry.watched ? (
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-1 text-[10px] font-bold uppercase text-white">
            Watched
          </span>
        ) : null}
      </Link>
      <Link href={`/anime/${entry.id}`} className="line-clamp-2 text-sm font-semibold text-foreground hover:text-accent">
        {entry.title}
      </Link>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onToggleWatched(entry.id)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border py-1.5 text-xs font-medium text-foreground hover:bg-surface-hover"
          aria-pressed={entry.watched}
        >
          {entry.watched ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          ) : (
            <Circle className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {entry.watched ? "Watched" : "Mark watched"}
        </button>
        <button
          type="button"
          onClick={() => onRemove(entry.id)}
          aria-label={`Remove ${entry.title} from watchlist`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted hover:border-crimson hover:text-crimson"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
