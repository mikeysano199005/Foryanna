import { AnimeCardSkeletonRow } from "./AnimeCardSkeleton";

export function SearchSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-11 w-full max-w-xl animate-pulse rounded-full bg-surface-hover" />
      <AnimeCardSkeletonRow count={12} />
    </div>
  );
}
