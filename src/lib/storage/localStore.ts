// Generic localStorage-backed list store exposing the subscribe/getSnapshot
// contract React's useSyncExternalStore expects, so hooks never need to
// mirror external state into React state inside an effect.

type Listener = () => void;

export interface LocalListStore<T> {
  get(): T[];
  set(next: T[]): void;
  getSnapshot(): T[];
  getServerSnapshot(): T[];
  subscribe(listener: Listener): () => void;
}

const EMPTY: never[] = [];

export function createLocalListStore<T>(key: string): LocalListStore<T> {
  let cache: T[] | null = null;
  const listeners = new Set<Listener>();

  function readFromDisk(): T[] {
    if (typeof window === "undefined") return EMPTY;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T[]) : EMPTY;
    } catch {
      return EMPTY;
    }
  }

  function getSnapshot(): T[] {
    if (cache === null) cache = readFromDisk();
    return cache;
  }

  function getServerSnapshot(): T[] {
    return EMPTY;
  }

  function set(next: T[]): void {
    cache = next;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Storage unavailable (private mode, quota) — fail silently.
      }
    }
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: Listener): () => void {
    listeners.add(listener);
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key) {
        cache = readFromDisk();
        listener();
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorage);
    }
    return () => {
      listeners.delete(listener);
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorage);
      }
    };
  }

  return { get: getSnapshot, set, getSnapshot, getServerSnapshot, subscribe };
}
