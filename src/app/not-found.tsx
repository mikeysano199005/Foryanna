import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-5 px-4 text-center">
      <Logo />
      <span className="text-7xl font-extrabold text-accent">404</span>
      <h1 className="text-xl font-bold text-foreground">This page doesn&apos;t exist</h1>
      <p className="text-sm text-muted">
        The page you&apos;re looking for may have been moved, renamed, or never existed. Let&apos;s
        get you back on track.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-white hover:bg-accent-strong"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Go Home
        </Link>
        <Link
          href="/anime"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-6 text-sm font-semibold text-foreground hover:bg-surface-hover"
        >
          <Compass className="h-4 w-4" aria-hidden="true" />
          Browse Anime
        </Link>
      </div>
    </div>
  );
}
