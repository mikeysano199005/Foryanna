"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { cn } from "@/lib/utils/cn";

export function SearchBar({
  initialQuery = "",
  autoFocus,
  className,
  onClose,
  value,
  onChange,
}: {
  initialQuery?: string;
  autoFocus?: boolean;
  className?: string;
  onClose?: () => void;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [internalQuery, setInternalQuery] = useState(initialQuery);
  const router = useRouter();
  const isControlled = value !== undefined;
  const query = isControlled ? value : internalQuery;
  const setQuery = isControlled ? (onChange as (value: string) => void) : setInternalQuery;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    if (!isControlled) router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit} role="search" className={cn("relative w-full", className)}>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search anime titles..."
        aria-label="Search anime"
        autoFocus={autoFocus}
        className="h-11 w-full rounded-full border border-border bg-surface pl-11 pr-10 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
      />
      {query ? (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-surface-hover"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </form>
  );
}
