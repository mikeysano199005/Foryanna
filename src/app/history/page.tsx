"use client";

import Link from "next/link";
import { History as HistoryIcon, Play, Trash2 } from "lucide-react";
import { SafeImage } from "@/components/SafeImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useHistory } from "@/hooks/useHistory";

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(iso),
  );
}

export default function HistoryPage() {
  const { entries, hydrated, remove, clear } = useHistory();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Watch History</h1>
          <p className="mt-1 text-sm text-muted">Anime you&apos;ve recently watched trailers for.</p>
        </div>
        {entries.length > 0 ? (
          <Button variant="outline" size="sm" onClick={clear}>
            Clear all
          </Button>
        ) : null}
      </div>

      {!hydrated ? null : entries.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="No watch history yet"
          description="Anime you watch trailers for will appear here so you can pick up where you left off."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-surface p-3"
            >
              <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-hover">
                <SafeImage src={entry.image} alt={entry.title} fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/anime/${entry.id}`} className="line-clamp-1 font-semibold text-foreground hover:text-accent">
                  {entry.title}
                </Link>
                <p className="text-xs text-muted">{formatRelativeTime(entry.lastWatchedAt)}</p>
                <div className="mt-1.5 h-1 w-full max-w-[160px] overflow-hidden rounded-full bg-surface-hover">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${entry.progress}%` }} />
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/watch/${entry.id}`}
                  aria-label={`Continue watching ${entry.title}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white hover:bg-accent-strong"
                >
                  <Play className="h-4 w-4" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => remove(entry.id)}
                  aria-label={`Remove ${entry.title} from history`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted hover:border-crimson hover:text-crimson"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
