export function HeroSkeleton() {
  return (
    <div className="relative h-[70vh] min-h-[480px] w-full animate-pulse overflow-hidden rounded-b-3xl bg-surface-hover sm:rounded-3xl">
      <div className="absolute bottom-8 left-4 flex max-w-lg flex-col gap-3 sm:bottom-12 sm:left-10">
        <div className="h-4 w-24 rounded-full bg-surface" />
        <div className="h-10 w-72 rounded bg-surface" />
        <div className="h-4 w-full max-w-md rounded bg-surface" />
        <div className="h-4 w-3/4 max-w-sm rounded bg-surface" />
        <div className="mt-2 flex gap-3">
          <div className="h-11 w-32 rounded-full bg-surface" />
          <div className="h-11 w-32 rounded-full bg-surface" />
        </div>
      </div>
    </div>
  );
}
