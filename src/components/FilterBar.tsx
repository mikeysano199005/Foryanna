"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const SORT_OPTIONS = [
  { value: "popularity:asc", label: "Most Popular" },
  { value: "score:desc", label: "Highest Score" },
  { value: "start_date:desc", label: "Newest" },
  { value: "title:asc", label: "Alphabetical (A-Z)" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Any Status" },
  { value: "airing", label: "Airing" },
  { value: "complete", label: "Completed" },
  { value: "upcoming", label: "Upcoming" },
];

const TYPE_OPTIONS = [
  { value: "", label: "Any Type" },
  { value: "tv", label: "TV" },
  { value: "movie", label: "Movie" },
  { value: "ova", label: "OVA" },
  { value: "special", label: "Special" },
  { value: "ona", label: "ONA" },
];

export function FilterBar({ showStatus = true, showType = true }: { showStatus?: boolean; showType?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const orderBy = searchParams.get("order_by") ?? "popularity";
  const sort = searchParams.get("sort") ?? "asc";
  const status = searchParams.get("status") ?? "";
  const type = searchParams.get("type") ?? "";
  const sortValue = `${orderBy}:${sort}`;

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="hidden items-center gap-1.5 text-sm font-medium text-muted sm:flex">
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        Filter
      </span>
      <Select
        label="Sort by"
        value={sortValue}
        onChange={(value) => {
          const [nextOrderBy, nextSort] = value.split(":");
          const params = new URLSearchParams(searchParams.toString());
          params.set("order_by", nextOrderBy);
          params.set("sort", nextSort);
          params.delete("page");
          router.push(`${pathname}?${params.toString()}`);
        }}
        options={SORT_OPTIONS}
      />
      {showStatus ? (
        <Select
          label="Status"
          value={status}
          onChange={(value) => updateParam("status", value)}
          options={STATUS_OPTIONS}
        />
      ) : null}
      {showType ? (
        <Select
          label="Type"
          value={type}
          onChange={(value) => updateParam("type", value)}
          options={TYPE_OPTIONS}
        />
      ) : null}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className={cn("relative")}>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-full border border-border bg-surface px-3.5 pr-8 text-xs font-medium text-foreground focus:border-accent focus:outline-none appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
