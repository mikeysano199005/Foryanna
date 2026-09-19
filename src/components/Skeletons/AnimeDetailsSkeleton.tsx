export function AnimeDetailsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-64 w-full bg-surface-hover sm:h-80" />
      <div className="mx-auto -mt-20 flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:px-6">
        <div className="aspect-[2/3] w-40 shrink-0 rounded-xl bg-surface sm:w-56" />
        <div className="flex flex-1 flex-col gap-3 pt-4">
          <div className="h-8 w-2/3 rounded bg-surface-hover" />
          <div className="h-4 w-1/3 rounded bg-surface-hover" />
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full bg-surface-hover" />
            <div className="h-6 w-16 rounded-full bg-surface-hover" />
            <div className="h-6 w-16 rounded-full bg-surface-hover" />
          </div>
          <div className="h-4 w-full rounded bg-surface-hover" />
          <div className="h-4 w-full rounded bg-surface-hover" />
          <div className="h-4 w-2/3 rounded bg-surface-hover" />
        </div>
      </div>
    </div>
  );
}
