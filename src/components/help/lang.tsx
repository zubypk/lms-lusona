import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { HelpLang } from "@/lib/help/articles";

const KEY = "lms.help.lang";

type HelpLangState = {
  lang: HelpLang;
  setLang: (lang: HelpLang) => void;
};

const HelpLangContext = createContext<HelpLangState | null>(null);

export function HelpLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<HelpLang>("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === "ur" || saved === "en") setLangState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = (next: HelpLang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
  };

  return <HelpLangContext.Provider value={{ lang, setLang }}>{children}</HelpLangContext.Provider>;
}

export function useHelpLang() {
  const ctx = useContext(HelpLangContext);
  if (!ctx) throw new Error("HelpLangProvider missing");
  return ctx;
}
