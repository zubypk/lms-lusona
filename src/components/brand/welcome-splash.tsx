import { useEffect, useState } from "react";
import { Crest } from "@/components/brand/crest";
import { CAMPUS_DOMAIN } from "@/lib/build";

const SPLASH_KEY = "lms.welcome.session";

export function WelcomeSplash() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SPLASH_KEY) === "1") return;
    } catch {
      /* ignore */
    }
    setVisible(true);
    const hide = window.setTimeout(() => setLeaving(true), 1700);
    const gone = window.setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem(SPLASH_KEY, "1");
      } catch {
        /* ignore */
      }
    }, 2100);
    return () => {
      window.clearTimeout(hide);
      window.clearTimeout(gone);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[80] grid place-items-center bg-navy text-white transition-opacity duration-300 ${leaving ? "opacity-0" : "opacity-100"}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center px-6 text-center">
        <Crest className="h-16 w-16" light />
        <p className="mt-5 text-[10px] tracking-[0.28em] text-white/55 uppercase">Atomic Energy Commission College</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Welcome</h1>
        <p className="mt-2 max-w-sm text-sm text-white/70">
          The campus learning system is ready. Session 2025–26 · {CAMPUS_DOMAIN}
        </p>
        <div className="mt-8 h-0.5 w-40 overflow-hidden rounded-full bg-white/15">
          <div className="lms-splash-bar h-full bg-white" />
        </div>
      </div>
    </div>
  );
}
