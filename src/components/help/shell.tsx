import { Link, Outlet } from "@tanstack/react-router";
import { AppearanceControls } from "@/components/appearance/controls";
import { Wordmark } from "@/components/brand/crest";
import { HelpLangProvider, useHelpLang } from "@/components/help/lang";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/help" as const, en: "All topics", ur: "تمام موضوعات" },
  { to: "/help/enrolment" as const, en: "Enrolment", ur: "اندراج" },
  { to: "/help/attendance" as const, en: "Attendance", ur: "حاضری" },
  { to: "/help/results" as const, en: "Results", ur: "نتائج" },
  { to: "/help/account" as const, en: "Campus account", ur: "اکاؤنٹ" },
];

function HelpFrame() {
  const { lang, setLang } = useHelpLang();
  const urdu = lang === "ur";
  return (
    <div dir={urdu ? "rtl" : "ltr"} lang={urdu ? "ur" : "en"} className={urdu ? "lms-urdu min-h-dvh" : "min-h-dvh"}>
      <header className="border-b border-line bg-surface/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5">
          <Wordmark compact />
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <div className="flex rounded-md border border-line bg-paper p-0.5" role="group" aria-label={urdu ? "زبان" : "Language"}>
              <button
                type="button"
                className={`min-h-11 rounded px-3 text-sm ${lang === "en" ? "bg-surface font-medium text-ink shadow-[var(--shadow-card)]" : "text-muted"}`}
                aria-pressed={lang === "en"}
                onClick={() => setLang("en")}
              >
                English
              </button>
              <button
                type="button"
                className={`min-h-11 rounded px-3 text-sm ${lang === "ur" ? "bg-surface font-medium text-ink shadow-[var(--shadow-card)]" : "text-muted"}`}
                aria-pressed={lang === "ur"}
                onClick={() => setLang("ur")}
              >
                اردو
              </button>
            </div>
            <AppearanceControls />
            <Button asChild variant="outline" className="h-11">
              <Link to="/login">{urdu ? "سائن اِن" : "Sign in"}</Link>
            </Button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-3 sm:px-5" aria-label={urdu ? "رہنمائی" : "Help"}>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="shrink-0 rounded-full border border-line bg-paper px-3 py-2 text-sm text-ink hover:border-primary"
              activeOptions={{ exact: true }}
              activeProps={{ className: "shrink-0 rounded-full border border-primary bg-navy px-3 py-2 text-sm text-white" }}
            >
              {urdu ? item.ur : item.en}
            </Link>
          ))}
        </nav>
      </header>
      <Outlet />
      <SiteFooter />
    </div>
  );
}

export function HelpShell() {
  return (
    <HelpLangProvider>
      <HelpFrame />
    </HelpLangProvider>
  );
}
