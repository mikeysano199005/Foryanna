import { createLocalListStore } from "./localStore";
import type { HistoryEntry } from "./types";

const KEY = "animora:history";
const MAX_ENTRIES = 50;

const store = createLocalListStore<HistoryEntry>(KEY);

export const subscribeHistory = store.subscribe;
export const getHistorySnapshot = store.getSnapshot;
export const getHistoryServerSnapshot = store.getServerSnapshot;

export function getHistory(): HistoryEntry[] {
  return store.get();
}

export function recordHistory(entry: Omit<HistoryEntry, "lastWatchedAt">): void {
  const list = store.get().filter((item) => item.id !== entry.id);
  const next: HistoryEntry[] = [
    { ...entry, lastWatchedAt: new Date().toISOString() },
    ...list,
  ].slice(0, MAX_ENTRIES);
  store.set(next);
}

export function removeHistoryEntry(id: number): void {
  store.set(store.get().filter((entry) => entry.id !== id));
}

export function clearHistory(): void {
  store.set([]);
}
