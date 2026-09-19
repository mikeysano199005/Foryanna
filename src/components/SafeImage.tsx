"use client";

import Image, { type ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

type SafeImageProps = Omit<ImageProps, "src" | "onError" | "alt"> & {
  src: string | null | undefined;
  alt: string;
};

/**
 * Wraps next/image with a graceful fallback for missing/broken poster art,
 * so a dead Jikan CDN link never leaves a blank box in the grid.
 */
export function SafeImage({ src, alt, className, ...props }: SafeImageProps) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-surface-hover text-muted",
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="h-1/4 w-1/4 min-h-6 min-w-6" aria-hidden="true" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      {...props}
    />
  );
}
