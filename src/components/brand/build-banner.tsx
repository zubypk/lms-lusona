import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { BUILD, SEEN_BUILD_KEY } from "@/lib/build";
import { getPublicCampus } from "@/lib/lms/public";

export function BuildBanner() {
  const campus = useQuery({ queryKey: ["public-campus"], queryFn: () => getPublicCampus() });
  const message = campus.data?.build_message || BUILD.message;
  const token = `${BUILD.number}::${message}`;
  const [open, setOpen] = useState(true);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(SEEN_BUILD_KEY) === token) setOpen(false);
    } catch {
      /* ignore */
    }
  }, [token]);

  function dismiss() {
    setOpen(false);
    try {
      window.localStorage.setItem(SEEN_BUILD_KEY, token);
    } catch {
      /* ignore */
    }
  }

  if (!open) return null;

  return (
    <div className="relative z-[60] border-b border-accent/30 bg-info-bg px-4 py-2.5 text-ink">
      <div className="mx-auto flex max-w-6xl items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-medium tracking-[0.16em] text-primary uppercase">
            New build {BUILD.number} · {BUILD.title}
          </div>
          <p className="mt-0.5 text-sm text-ink-soft">{message}</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-md text-muted hover:bg-surface hover:text-ink"
          aria-label="Dismiss build notice"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
