import { Link } from "@tanstack/react-router";
import { BUILD } from "@/lib/build";
import { HardRefreshButton } from "@/components/brand/hard-refresh";

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer className="border-t border-line bg-surface/80">
      <div
        className={`mx-auto flex max-w-6xl flex-col gap-2 px-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between ${compact ? "py-3" : "px-5 py-5"}`}
      >
        <span>LMS · Learning Management System</span>
        <span className="flex flex-wrap items-center gap-3">
          <Link to="/help" className="underline-offset-2 hover:text-ink hover:underline">
            Help
          </Link>
          <a href="/refresh" className="underline-offset-2 hover:text-ink hover:underline">
            Refresh
          </a>
          <span className="tabular-nums">Build {BUILD.number}</span>
          {compact ? null : <HardRefreshButton />}
        </span>
      </div>
    </footer>
  );
}