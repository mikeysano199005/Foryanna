import type { Metadata } from "next";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the ANIMORA team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">Contact</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
        Have feedback, found a bug, or have a takedown request regarding linked content? Reach
        out and we&apos;ll get back to you.
      </p>
      <a
        href="mailto:hello@animora.example.com"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-strong"
      >
        <Mail className="h-4 w-4" aria-hidden="true" />
        hello@animora.example.com
      </a>
    </div>
  );
}
