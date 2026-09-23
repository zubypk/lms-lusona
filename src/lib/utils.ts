import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const HIDDEN_PLATFORM_NAMES = /^(grok(\s+(user|app))?|xai|x\.ai|dev user)$/i;

/** Strip platform/vendor names from anything shown in the LMS UI. */
export function publicDisplayName(name: string | null | undefined, fallback = "LMS member") {
  const value = (name ?? "").trim();
  if (!value || HIDDEN_PLATFORM_NAMES.test(value)) return fallback;
  return value;
}
