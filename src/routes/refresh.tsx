import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Crest } from "@/components/brand/crest";

export const Route = createFileRoute("/refresh")({ component: HardRefreshPage });

async function wipeClientCaches() {
  let session: string | null = null;
  try {
    session = sessionStorage.getItem("grok-auth.bearer-token");
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.clear();
    if (session) sessionStorage.setItem("grok-auth.bearer-token", session);
  } catch {
    /* ignore */
  }
  try {
    const regs = await navigator.serviceWorker?.getRegistrations();
    await Promise.all((regs ?? []).map((reg) => reg.unregister()));
  } catch {
    /* ignore */
  }
  try {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  } catch {
    /* ignore */
  }
}

function HardRefreshPage() {
  useEffect(() => {
    let cancelled = false;
    void wipeClientCaches().finally(() => {
      if (cancelled) return;
      const next = new URL("/", window.location.origin);
      next.searchParams.set("fresh", String(Date.now()));
      window.location.replace(next.toString());
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid min-h-dvh place-items-center bg-navy px-6 text-white">
      <div className="flex max-w-sm flex-col items-center text-center">
        <Crest className="h-14 w-14" light />
        <h1 className="mt-5 font-display text-3xl font-semibold">Refreshing LMS</h1>
        <p className="mt-2 text-sm text-white/70">Clearing the saved copy and loading the latest campus build…</p>
      </div>
    </div>
  );
}
