"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { AnimeCard } from "./AnimeCard";
import { AnimeCardSkeleton } from "./Skeletons/AnimeCardSkeleton";
import type { AnimeCardData } from "@/lib/types/anime";

export function AnimeCarousel({
  title,
  items,
  viewAllHref,
  loading,
}: {
  title: string;
  items: AnimeCardData[];
  viewAllHref?: string;
  loading?: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [items, updateScrollState]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  if (!loading && items.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-4 sm:px-6">
        <h2 className="text-lg font-bold text-foreground sm:text-xl">{title}</h2>
        <div className="flex items-center gap-2">
          {viewAllHref ? (
            <Link
              href={viewAllHref}
              className="text-sm font-medium text-accent hover:underline"
            >
              View all
            </Link>
          ) : null}
          <div className="hidden gap-1 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={!canScrollLeft}
              aria-label={`Scroll ${title} left`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-surface-hover disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={!canScrollRight}
              aria-label={`Scroll ${title} right`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-surface-hover disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <div
        ref={scrollerRef}
        onScroll={updateScrollState}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-1 sm:px-6"
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <AnimeCardSkeleton key={i} className="w-36 shrink-0 snap-start sm:w-44" />
            ))
          : items.map((item, i) => (
              <AnimeCard
                key={item.id}
                {...item}
                priority={i < 4}
                className="w-36 shrink-0 snap-start sm:w-44"
              />
            ))}
      </div>
    </section>
  );
}
