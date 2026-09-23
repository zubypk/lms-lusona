import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Crest } from "@/components/brand/crest";
import { Button } from "@/components/ui/button";
import { useMusic } from "@/components/brand/campus-music";
import { BUILD } from "@/lib/build";

const SPLASH_KEY = `lms.welcome.${BUILD.number}`;
const DURATION_MS = 3400;

export function WelcomeSplash() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [pct, setPct] = useState(4);
  const [ready, setReady] = useState(false);
  const music = useMusic();

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SPLASH_KEY) === "1") {
        setVisible(false);
        return;
      }
    } catch {
      /* first visit */
    }
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / DURATION_MS);
      setPct(Math.round(4 + t * 96));
      if (t >= 1) {
        setReady(true);
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    const auto = window.setTimeout(() => setReady(true), DURATION_MS + 50);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(auto);
    };
  }, []);

  function enter() {
    music.ensurePlaying();
    setLeaving(true);
    window.setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem(SPLASH_KEY, "1");
      } catch {
        /* ignore */
      }
    }, 280);
  }

  if (!visible || path.startsWith("/help")) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center bg-navy text-white transition-opacity duration-300 ${leaving ? "opacity-0" : "opacity-100"}`}
      role="dialog"
      aria-label="Welcome to LMS"
      aria-live="polite"
    >
      <div className="flex w-full max-w-sm flex-col items-center px-6 text-center">
        <Crest className="h-16 w-16" light />
        <p className="mt-5 text-[10px] tracking-[0.28em] text-white/55 uppercase">Learning Management System</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight !text-white sm:text-5xl">Welcome</h1>
        <p className="mt-2 text-sm !text-white/70">Loading the LMS test campus…</p>
        <div className="mt-8 w-full">
          <div className="mb-2 flex items-center justify-between text-[11px] tracking-wide text-white/60 uppercase">
            <span>Preparing</span>
            <span className="tabular-nums">{pct}%</span>
          </div>
          <div className="lms-rainbow-track h-3 w-full overflow-hidden rounded-full">
            <div
              className="lms-rainbow-bar h-full rounded-full transition-[width] duration-150"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <Button type="button" className="mt-8 w-full bg-white text-navy hover:bg-white/90" onClick={enter}>
          {ready || pct >= 100 ? "Enter LMS" : `Skip · ${pct}%`}
        </Button>
        <p className="mt-3 text-[11px] text-white/45">Test feed · work in progress · full site coming soon</p>
      </div>
    </div>
  );
}
