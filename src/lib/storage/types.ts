// Shared shapes for locally-persisted user data. Kept storage-agnostic so a
// Supabase-backed implementation can later satisfy the same interfaces.

export interface WatchlistEntry {
  id: number;
  title: string;
  image: string;
  score: number | null;
  type: string | null;
  watched: boolean;
  addedAt: string; // ISO timestamp
}

export interface HistoryEntry {
  id: number;
  title: string;
  image: string;
  lastWatchedAt: string; // ISO timestamp
  progress: number; // 0-100
}
