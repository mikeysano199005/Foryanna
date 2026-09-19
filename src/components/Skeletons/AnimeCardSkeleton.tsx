import { cn } from "@/lib/utils/cn";

export function AnimeCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="aspect-[2/3] w-full animate-pulse rounded-xl bg-surface-hover" />
      <div className="h-3.5 w-4/5 animate-pulse rounded bg-surface-hover" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-surface-hover" />
    </div>
  );
}

export function AnimeCardSkeletonRow({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  );
}
