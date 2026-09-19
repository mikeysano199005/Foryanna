import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Pagination({
  currentPage,
  hasNextPage,
  basePath,
  searchParams = {},
}: {
  currentPage: number;
  hasNextPage: boolean;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
}) {
  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params.set(key, value);
    }
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  };

  const prevDisabled = currentPage <= 1;
  const nextDisabled = !hasNextPage;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-3 py-8">
      <PageLink href={buildHref(currentPage - 1)} disabled={prevDisabled} aria-label="Previous page">
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Previous
      </PageLink>
      <span className="text-sm font-medium text-muted">Page {currentPage}</span>
      <PageLink href={buildHref(currentPage + 1)} disabled={nextDisabled} aria-label="Next page">
        Next
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  children,
  "aria-label": ariaLabel,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
  "aria-label": string;
}) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        aria-label={ariaLabel}
        className="inline-flex cursor-not-allowed items-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted opacity-40"
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover",
      )}
    >
      {children}
    </Link>
  );
}
