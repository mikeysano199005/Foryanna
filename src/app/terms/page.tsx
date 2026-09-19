import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "ANIMORA terms of service.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
      <div className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-muted">
        <p>Last updated: {new Date().getFullYear()}</p>
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">Use of the service</h2>
          <p>
            ANIMORA provides anime discovery information for personal, non-commercial use. You
            agree not to misuse the service, attempt to disrupt it, or use it to infringe on any
            copyright or intellectual property.
          </p>
        </section>
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">Content</h2>
          <p>
            ANIMORA does not host or distribute copyrighted anime episodes. All trailer playback
            uses officially published, licensed sources. Anime metadata is provided by the Jikan
            API / MyAnimeList community and may contain inaccuracies.
          </p>
        </section>
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">No warranty</h2>
          <p>
            The service is provided &quot;as is&quot; without warranties of any kind. We are not
            responsible for third-party API downtime or inaccuracies in externally sourced data.
          </p>
        </section>
      </div>
    </div>
  );
}
