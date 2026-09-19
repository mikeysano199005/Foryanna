import Link from "next/link";
import { Star } from "lucide-react";
import { SafeImage } from "./SafeImage";
import { cn } from "@/lib/utils/cn";
import { formatEpisodes, formatScore } from "@/lib/utils/format";
import type { AnimeCardData } from "@/lib/types/anime";

interface AnimeCardProps extends AnimeCardData {
  className?: string;
  priority?: boolean;
}

export function AnimeCard({
  id,
  title,
  image,
  score,
  type,
  episodes,
  rank,
  className,
  priority,
}: AnimeCardProps) {
  return (
    <Link
      href={`/anime/${id}`}
      className={cn(
        "group relative flex flex-col gap-2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className,
      )}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-surface-hover shadow-sm">
        <SafeImage
          src={image}
          alt={title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 200px"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:opacity-100 motion-reduce:from-black/60"
          aria-hidden="true"
        />
        {rank ? (
          <span className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-xs font-bold text-white backdrop-blur-sm">
            #{rank}
          </span>
        ) : null}
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden="true" />
          {formatScore(score)}
        </span>
        <div className="absolute inset-x-0 bottom-0 flex translate-y-2 flex-wrap gap-1 p-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100">
          {type ? (
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
              {type}
            </span>
          ) : null}
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
            {formatEpisodes(episodes)}
          </span>
        </div>
      </div>
      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-accent">
        {title}
      </h3>
    </Link>
  );
}
