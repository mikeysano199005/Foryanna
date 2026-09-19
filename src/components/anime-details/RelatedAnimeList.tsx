import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AnimeFull } from "@/lib/types/anime";

export function RelatedAnimeList({ relations }: { relations: AnimeFull["relations"] }) {
  const filtered = (relations ?? []).filter((rel) =>
    rel.entry.some((entry) => entry.type === "anime"),
  );

  if (filtered.length === 0) {
    return <EmptyState title="No related anime listed." />;
  }

  return (
    <div className="flex flex-col gap-4">
      {filtered.map((rel) => (
        <div key={rel.relation} className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-muted">{rel.relation}</h3>
          <div className="flex flex-wrap gap-2">
            {rel.entry
              .filter((entry) => entry.type === "anime")
              .map((entry) => (
                <Link
                  key={entry.mal_id}
                  href={`/anime/${entry.mal_id}`}
                  className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover hover:text-accent"
                >
                  {entry.name}
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
