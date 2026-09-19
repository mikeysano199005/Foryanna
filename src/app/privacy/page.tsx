import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "ANIMORA privacy policy.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
      <div className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-muted">
        <p>Last updated: {new Date().getFullYear()}</p>
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">Data we store locally</h2>
          <p>
            By default, your watchlist, watch history and theme preference are stored only in
            your browser&apos;s local storage. This data never leaves your device unless you
            create an account.
          </p>
        </section>
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">Accounts</h2>
          <p>
            If account sign-in is enabled, your email address and authentication data are
            processed by our authentication provider to create and secure your account. We do not
            sell personal data to third parties.
          </p>
        </section>
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">Third-party data</h2>
          <p>
            Anime metadata and images are retrieved from the Jikan API (MyAnimeList). Trailer
            playback embeds official YouTube videos, which are subject to YouTube&apos;s own
            privacy policy.
          </p>
        </section>
      </div>
    </div>
  );
}
