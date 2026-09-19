"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";
import { WatchlistCard } from "@/components/WatchlistCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { AnimeCardSkeletonRow } from "@/components/Skeletons/AnimeCardSkeleton";
import { useWatchlist } from "@/hooks/useWatchlist";

export default function WatchlistPage() {
  const { entries, hydrated, remove, toggleWatched } = useWatchlist();
  const watchedCount = entries.filter((e) => e.watched).length;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">My Watchlist</h1>
        <p className="text-sm text-muted">
          {hydrated ? `${entries.length} title${entries.length === 1 ? "" : "s"} saved · ${watchedCount} watched` : "Loading..."}
        </p>
      </div>

      {!hydrated ? (
        <AnimeCardSkeletonRow count={12} />
      ) : entries.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Your watchlist is empty"
          description="Add anime you want to watch later — they'll show up here."
          action={
            <Link
              href="/anime"
              className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-white hover:bg-accent-strong"
            >
              Browse Anime
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {entries.map((entry) => (
            <WatchlistCard key={entry.id} entry={entry} onRemove={remove} onToggleWatched={toggleWatched} />
          ))}
        </div>
      )}
    </div>
  );
}
