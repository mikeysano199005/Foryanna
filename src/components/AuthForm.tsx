"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/Logo";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { signInWithPassword, signUpWithPassword, isConfigured } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = isLogin
      ? await signInWithPassword(email, password)
      : await signUpWithPassword(email, password);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (isLogin) {
      router.push("/profile");
    } else {
      setRegistered(true);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center gap-6 px-4 py-12 sm:px-0">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo />
        <h1 className="text-xl font-bold text-foreground">
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-muted">
          {isLogin
            ? "Sign in to sync your watchlist across devices."
            : "Sign up to save your watchlist and history."}
        </p>
      </div>

      {!isConfigured ? (
        <div className="flex items-start gap-2 rounded-xl border border-dashed border-border bg-surface/60 p-3 text-xs text-muted">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            Authentication isn&apos;t configured for this deployment yet. Your watchlist and
            history still work locally on this device without an account.
          </p>
        </div>
      ) : null}

      {registered ? (
        <div className="rounded-xl border border-accent/40 bg-accent-soft p-4 text-sm text-foreground">
          Check your email to confirm your account, then{" "}
          <Link href="/login" className="font-semibold text-accent hover:underline">
            log in
          </Link>
          .
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isConfigured}
              className="h-11 rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground focus:border-accent focus:outline-none disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!isConfigured}
              className="h-11 rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground focus:border-accent focus:outline-none disabled:opacity-50"
            />
          </div>

          {error ? (
            <p role="alert" className="text-sm text-crimson">
              {error}
            </p>
          ) : null}

          <Button type="submit" disabled={submitting || !isConfigured} className="mt-1">
            {submitting ? "Please wait…" : isLogin ? "Log In" : "Create Account"}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-muted">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <Link href={isLogin ? "/register" : "/login"} className="font-semibold text-accent hover:underline">
          {isLogin ? "Sign up" : "Log in"}
        </Link>
      </p>
    </div>
  );
}
