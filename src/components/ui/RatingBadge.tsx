import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatScore } from "@/lib/utils/format";

export function RatingBadge({
  score,
  className,
}: {
  score: number | null;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm",
        className,
      )}
    >
      <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden="true" />
      {formatScore(score)}
    </span>
  );
}
