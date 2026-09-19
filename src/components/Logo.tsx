import { cn } from "@/lib/utils/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        aria-hidden="true"
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-crimson shadow-sm"
      >
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-white">
          <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.5 3.6L12 11.5 5.5 7.9 12 4.3ZM5 9.6l6 3.3v6.8l-6-3.3V9.6Zm8 10.1v-6.8l6-3.3v6.7l-6 3.4Z" />
        </svg>
      </span>
      <span className="text-lg font-extrabold tracking-tight text-foreground">
        ANIM<span className="text-accent">ORA</span>
      </span>
    </span>
  );
}
