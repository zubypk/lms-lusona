import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  applyAppearance,
  readStoredBackground,
  readStoredTheme,
  THEME_KEY,
  BACKGROUND_KEY,
  type BackgroundId,
  type ThemeId,
} from "@/lib/appearance";

type AppearanceState = {
  theme: ThemeId;
  background: BackgroundId;
  setTheme: (id: ThemeId) => void;
  setBackground: (id: BackgroundId) => void;
};

const AppearanceContext = createContext<AppearanceState | null>(null);

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("campus");
  const [background, setBackgroundState] = useState<BackgroundId>("linen");

  useEffect(() => {
    const t = readStoredTheme();
    const b = readStoredBackground();
    setThemeState(t);
    setBackgroundState(b);
    applyAppearance(t, b);
  }, []);

  useEffect(() => {
    applyAppearance(theme, background);
    try {
      window.localStorage.setItem(THEME_KEY, theme);
      window.localStorage.setItem(BACKGROUND_KEY, background);
    } catch {
      /* ignore quota */
    }
  }, [theme, background]);

  const value = useMemo<AppearanceState>(
    () => ({
      theme,
      background,
      setTheme: setThemeState,
      setBackground: setBackgroundState,
    }),
    [theme, background],
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const ctx = useContext(AppearanceContext);
  if (!ctx) throw new Error("AppearanceProvider missing");
  return ctx;
}
