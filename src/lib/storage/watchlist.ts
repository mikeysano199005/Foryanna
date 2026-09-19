import { createLocalListStore } from "./localStore";
import type { WatchlistEntry } from "./types";

const KEY = "animora:watchlist";

/**
 * localStorage-backed watchlist. Swap the bodies of these functions for
 * Supabase table reads/writes later without touching call sites.
 */
const store = createLocalListStore<WatchlistEntry>(KEY);

export const subscribeWatchlist = store.subscribe;
export const getWatchlistSnapshot = store.getSnapshot;
export const getWatchlistServerSnapshot = store.getServerSnapshot;

export function getWatchlist(): WatchlistEntry[] {
  return store.get();
}

export function isInWatchlist(id: number): boolean {
  return store.get().some((entry) => entry.id === id);
}

export function addToWatchlist(entry: Omit<WatchlistEntry, "addedAt" | "watched">): void {
  const list = store.get();
  if (list.some((item) => item.id === entry.id)) return;
  store.set([{ ...entry, watched: false, addedAt: new Date().toISOString() }, ...list]);
}

export function removeFromWatchlist(id: number): void {
  store.set(store.get().filter((entry) => entry.id !== id));
}

export function toggleWatched(id: number): void {
  store.set(
    store.get().map((entry) => (entry.id === id ? { ...entry, watched: !entry.watched } : entry)),
  );
}

export function clearWatchlist(): void {
  store.set([]);
}
