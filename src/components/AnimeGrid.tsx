import { AnimeCard } from "./AnimeCard";
import { EmptyState } from "./ui/EmptyState";
import type { AnimeCardData } from "@/lib/types/anime";

export function AnimeGrid({
  items,
  emptyTitle = "No anime found.",
  emptyDescription = "Try adjusting your filters or search terms.",
}: {
  items: AnimeCardData[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <AnimeCard key={item.id} {...item} />
      ))}
    </div>
  );
}
