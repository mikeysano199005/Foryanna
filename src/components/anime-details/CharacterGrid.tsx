import { SafeImage } from "@/components/SafeImage";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AnimeCharacterEdge } from "@/lib/types/anime";

export function CharacterGrid({ characters }: { characters: AnimeCharacterEdge[] }) {
  if (characters.length === 0) {
    return <EmptyState title="No character data available." />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {characters.slice(0, 20).map((edge) => (
        <div key={edge.character.mal_id} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-2.5">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-surface-hover">
            <SafeImage
              src={edge.character.images?.webp?.image_url || edge.character.images?.jpg?.image_url}
              alt={edge.character.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{edge.character.name}</p>
            <p className="text-xs text-muted">{edge.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
