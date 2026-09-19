import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPageContent } from "@/components/SearchPageContent";
import { SearchSkeleton } from "@/components/Skeletons/SearchSkeleton";

export const metadata: Metadata = {
  title: "Search",
  description: "Search thousands of anime titles on ANIMORA.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <SearchSkeleton />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
