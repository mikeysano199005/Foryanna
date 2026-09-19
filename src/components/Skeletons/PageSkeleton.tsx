import { AnimeCardSkeletonRow } from "./AnimeCardSkeleton";

export function PageSkeleton({ title = true }: { title?: boolean }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6">
      {title ? <div className="h-8 w-56 animate-pulse rounded bg-surface-hover" /> : null}
      <AnimeCardSkeletonRow count={18} />
    </div>
  );
}
