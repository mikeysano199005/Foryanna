"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Star, Calendar, Clapperboard } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SafeImage } from "./SafeImage";
import { formatEpisodes, formatScore } from "@/lib/utils/format";
import type { AnimeSummary } from "@/lib/types/anime";

export function Hero({ items }: { items: AnimeSummary[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [items.length]);

  const anime = items[index];
  if (!anime) return null;

  const image =
    anime.images?.webp?.large_image_url ||
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url ||
    "";

  return (
    <section
      className="relative h-[78vh] min-h-[520px] w-full overflow-hidden bg-surface sm:rounded-3xl"
      aria-label="Featured anime"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={anime.mal_id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <SafeImage
            src={image}
            alt={anime.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/10 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={anime.mal_id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-x-0 bottom-0 flex flex-col gap-3 px-4 pb-8 sm:px-10 sm:pb-14 lg:max-w-2xl"
        >
          <span className="w-fit rounded-full bg-accent/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Featured
          </span>
          <h1 className="text-balance text-3xl font-extrabold leading-tight text-foreground sm:text-5xl">
            {anime.title_english || anime.title}
          </h1>
          {anime.title_japanese ? (
            <p className="text-sm font-medium text-muted">{anime.title_japanese}</p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <span className="inline-flex items-center gap-1 font-semibold text-foreground">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
              {formatScore(anime.score)}
            </span>
            {anime.year ? (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-4 w-4" aria-hidden="true" /> {anime.year}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1">
              <Clapperboard className="h-4 w-4" aria-hidden="true" />
              {formatEpisodes(anime.episodes)}
            </span>
          </div>

          {anime.genres.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {anime.genres.slice(0, 4).map((genre) => (
                <span
                  key={genre.mal_id}
                  className="rounded-full border border-border bg-black/30 px-2.5 py-1 text-xs text-foreground backdrop-blur-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          ) : null}

          {anime.synopsis ? (
            <p className="line-clamp-3 max-w-xl text-sm leading-relaxed text-muted sm:text-[15px]">
              {anime.synopsis}
            </p>
          ) : null}

          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              href={`/anime/${anime.mal_id}`}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <Info className="h-4 w-4" aria-hidden="true" />
              View Details
            </Link>
            <Link
              href={`/watch/${anime.mal_id}`}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 bg-black/30 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <Play className="h-4 w-4 fill-white" aria-hidden="true" />
              Watch Trailer
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {items.length > 1 ? (
        <div className="absolute right-4 top-4 flex gap-1.5 sm:right-8 sm:top-8">
          {items.map((item, i) => (
            <button
              key={item.mal_id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show featured anime ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-accent" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
