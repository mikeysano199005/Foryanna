export function formatScore(score: number | null): string {
  if (score === null || Number.isNaN(score)) return "N/A";
  return score.toFixed(2);
}

export function formatCompactNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );
}

export function formatEpisodes(episodes: number | null): string {
  if (!episodes) return "? eps";
  return `${episodes} ep${episodes === 1 ? "" : "s"}`;
}

export function formatStatus(status: string | null): string {
  if (!status) return "Unknown";
  return status;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "TBA";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "TBA";
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(
    date,
  );
}

export function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function slugifyGenre(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
