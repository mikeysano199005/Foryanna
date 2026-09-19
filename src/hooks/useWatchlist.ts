"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  addToWatchlist,
  clearWatchlist,
  getWatchlistServerSnapshot,
  getWatchlistSnapshot,
  removeFromWatchlist,
  subscribeWatchlist,
  toggleWatched,
} from "@/lib/storage/watchlist";

export function useWatchlist() {
  const entries = useSyncExternalStore(
    subscribeWatchlist,
    getWatchlistSnapshot,
    getWatchlistServerSnapshot,
  );

  const has = useCallback((id: number) => entries.some((entry) => entry.id === id), [entries]);

  return {
    entries,
    hydrated: true,
    has,
    add: addToWatchlist,
    remove: removeFromWatchlist,
    toggleWatched,
    clear: clearWatchlist,
  };
}
