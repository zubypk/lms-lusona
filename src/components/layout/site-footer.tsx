import { BUILD, CAMPUS_DOMAIN, MAIL_DOMAIN } from "@/lib/build";

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer className="border-t border-line bg-surface/80">
      <div
        className={`mx-auto flex max-w-6xl flex-col gap-1 px-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between ${compact ? "py-3" : "px-5 py-5"}`}
      >
        <span>Atomic Energy Commission College · Rawalpindi / Islamabad</span>
        <span className="tabular-nums">
          {CAMPUS_DOMAIN} · @{MAIL_DOMAIN} · Build {BUILD.number}
        </span>
      </div>
    </footer>
  );
}
