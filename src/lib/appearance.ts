export const THEMES = [
  { id: "campus", label: "Campus", blurb: "Navy academic" },
  { id: "midnight", label: "Midnight", blurb: "Dark reading" },
  { id: "pearl", label: "Pearl", blurb: "Warm paper" },
  { id: "pine", label: "Pine", blurb: "Deep green" },
  { id: "slate", label: "Slate", blurb: "Cool stone" },
] as const;

export const BACKGROUNDS = [
  { id: "linen", label: "Linen" },
  { id: "grid", label: "Grid" },
  { id: "dots", label: "Dotted" },
  { id: "wash", label: "Wash" },
  { id: "campus", label: "Courtyard" },
  { id: "solid", label: "Solid" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];
export type BackgroundId = (typeof BACKGROUNDS)[number]["id"];

export const THEME_KEY = "lms.theme";
export const BACKGROUND_KEY = "lms.background";

export function isThemeId(v: string | null | undefined): v is ThemeId {
  return THEMES.some((t) => t.id === v);
}

export function isBackgroundId(v: string | null | undefined): v is BackgroundId {
  return BACKGROUNDS.some((b) => b.id === v);
}

export function readStoredTheme(): ThemeId {
  if (typeof window === "undefined") return "campus";
  const v = window.localStorage.getItem(THEME_KEY);
  return isThemeId(v) ? v : "campus";
}

export function readStoredBackground(): BackgroundId {
  if (typeof window === "undefined") return "linen";
  const v = window.localStorage.getItem(BACKGROUND_KEY);
  return isBackgroundId(v) ? v : "linen";
}

export function applyAppearance(theme: ThemeId, background: BackgroundId) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.dataset.bg = background;
}
