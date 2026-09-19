"use client";

import { useSyncExternalStore } from "react";
import {
  clearHistory,
  getHistoryServerSnapshot,
  getHistorySnapshot,
  recordHistory,
  removeHistoryEntry,
  subscribeHistory,
} from "@/lib/storage/history";

export function useHistory() {
  const entries = useSyncExternalStore(
    subscribeHistory,
    getHistorySnapshot,
    getHistoryServerSnapshot,
  );

  return {
    entries,
    hydrated: true,
    record: recordHistory,
    remove: removeHistoryEntry,
    clear: clearHistory,
  };
}
