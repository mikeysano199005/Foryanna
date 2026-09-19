"use client";

import Link from "next/link";
import { Bookmark, CheckCircle2, LogOut, Moon, Sun, Trash2, User } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeProvider";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useHistory } from "@/hooks/useHistory";
import { Button } from "@/components/ui/Button";
import { SafeImage } from "@/components/SafeImage";

export default function ProfilePage() {
  const { user, isConfigured, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { entries: watchlist, clear: clearWatchlist } = useWatchlist();
  const { entries: history, clear: clearHistory } = useHistory();

  const watchedCount = watchlist.filter((e) => e.watched).length;
  const favorite = watchlist[0];
  const displayName = user?.email?.split("@")[0] ?? "Guest";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
          <User className="h-8 w-8" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold text-foreground capitalize">{displayName}</h1>
          <p className="truncate text-sm text-muted">{user?.email ?? "Not signed in"}</p>
        </div>
        {user ? (
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </Button>
        ) : (
          <Link
            href="/login"
            className="inline-flex h-9 items-center rounded-full bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-strong"
          >
            Log in
          </Link>
        )}
      </div>

      {!isConfigured ? (
        <p className="rounded-xl border border-dashed border-border bg-surface/50 px-4 py-3 text-xs text-muted">
          Authentication isn&apos;t configured yet — your watchlist and history are saved locally on this
          device. Set Supabase environment variables to enable accounts.
        </p>
      ) : null}

      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={Bookmark} label="Watchlist" value={watchlist.length} />
        <StatCard icon={CheckCircle2} label="Watched" value={watchedCount} />
        <StatCard icon={User} label="History" value={history.length} />
      </div>

      {favorite ? (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-foreground">Favorite Anime</h2>
          <Link
            href={`/anime/${favorite.id}`}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 hover:bg-surface-hover"
          >
            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-hover">
              <SafeImage src={favorite.image} alt={favorite.title} fill sizes="48px" className="object-cover" />
            </div>
            <span className="font-medium text-foreground">{favorite.title}</span>
          </Link>
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Settings</h2>
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
          <SettingRow
            label="Theme"
            description={theme === "dark" ? "Dark mode" : "Light mode"}
            action={
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-surface-hover"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            }
          />
          <SettingRow label="Language" description="English (more coming soon)" action={null} />
          <SettingRow
            label="Clear watch history"
            description={`${history.length} entries`}
            action={
              <Button variant="outline" size="sm" onClick={clearHistory} disabled={history.length === 0}>
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Clear
              </Button>
            }
          />
          <SettingRow
            label="Clear watchlist"
            description={`${watchlist.length} entries`}
            action={
              <Button variant="outline" size="sm" onClick={clearWatchlist} disabled={watchlist.length === 0}>
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Clear
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Bookmark;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-surface py-4">
      <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
      <span className="text-xl font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  );
}

function SettingRow({
  label,
  description,
  action,
}: {
  label: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
