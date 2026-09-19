import Link from "next/link";
import { slugifyGenre } from "@/lib/utils/format";

const GENRE_GRADIENTS = [
  "from-purple-600/80 to-fuchsia-700/60",
  "from-rose-600/80 to-purple-700/60",
  "from-indigo-600/80 to-violet-700/60",
  "from-fuchsia-600/80 to-rose-700/60",
  "from-violet-600/80 to-indigo-700/60",
];

export function GenreCard({
  id,
  name,
  count,
  index = 0,
}: {
  id: number;
  name: string;
  count?: number;
  index?: number;
}) {
  const gradient = GENRE_GRADIENTS[index % GENRE_GRADIENTS.length];
  return (
    <Link
      href={`/genres/${slugifyGenre(name)}?id=${id}`}
      className={`group relative flex h-24 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-4 shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]`}
    >
      <span className="text-base font-bold text-white drop-shadow-sm">{name}</span>
      {count ? <span className="text-xs text-white/80">{count.toLocaleString()} titles</span> : null}
    </Link>
  );
}
