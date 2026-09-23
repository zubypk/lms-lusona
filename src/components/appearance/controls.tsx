import type { ReactNode } from "react";
import { BACKGROUNDS, THEMES, type BackgroundId, type ThemeId } from "@/lib/appearance";
import { useAppearance } from "@/components/appearance/provider";
import { MusicToggle } from "@/components/brand/campus-music";
import { HardRefreshButton } from "@/components/brand/hard-refresh";
import { cn } from "@/lib/utils";

function NamedSelect({
  label,
  value,
  onChange,
  light,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  light?: boolean;
  children: ReactNode;
}) {
  return (
    <label
      className={cn(
        "flex min-h-11 min-w-[8.75rem] flex-col justify-center rounded-md border px-2.5 py-1",
        light ? "border-white/25 bg-white/10 text-white" : "border-line bg-surface text-ink",
      )}
    >
      <span className="text-[9px] font-medium tracking-[0.14em] uppercase opacity-70">{label}</span>
      <select
        className={cn(
          "w-full cursor-pointer bg-transparent text-xs font-semibold outline-none",
          light ? "text-white" : "text-heading",
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        {children}
      </select>
    </label>
  );
}

export function AppearanceControls({ light = false }: { light?: boolean }) {
  const { theme, background, setTheme, setBackground } = useAppearance();
  const themeMeta = THEMES.find((t) => t.id === theme);
  const bgMeta = BACKGROUNDS.find((b) => b.id === background);
  const lights = THEMES.filter((t) => t.scheme === "light");
  const darks = THEMES.filter((t) => t.scheme === "dark");
  const patterns = BACKGROUNDS.filter((b) => b.kind === "pattern");
  const photos = BACKGROUNDS.filter((b) => b.kind === "photo");
  const colours = BACKGROUNDS.filter((b) => b.kind === "colour");

  return (
    <div className="flex max-w-full flex-col items-stretch gap-1 sm:items-end">
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        <span
          className="grid h-11 w-11 place-items-center rounded-md border border-line bg-surface font-display text-base font-semibold text-heading"
          aria-hidden
          title="Heading colour for this theme"
        >
          Aa
        </span>
        <NamedSelect
          label="Theme"
          value={theme}
          light={light}
          onChange={(id) => setTheme(id as ThemeId)}
        >
          <optgroup label="Light">
            {lights.map((t) => (
              <option key={t.id} value={t.id} className="text-ink">
                {t.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="Dark">
            {darks.map((t) => (
              <option key={t.id} value={t.id} className="text-ink">
                {t.label}
              </option>
            ))}
          </optgroup>
        </NamedSelect>
        <NamedSelect
          label="Background"
          value={background}
          light={light}
          onChange={(id) => setBackground(id as BackgroundId)}
        >
          <optgroup label="Patterns">
            {patterns.map((b) => (
              <option key={b.id} value={b.id} className="text-ink">
                {b.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="Campus photos">
            {photos.map((b) => (
              <option key={b.id} value={b.id} className="text-ink">
                {b.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="Colour">
            {colours.map((b) => (
              <option key={b.id} value={b.id} className="text-ink">
                {b.label}
              </option>
            ))}
          </optgroup>
        </NamedSelect>
        <MusicToggle light={light} />
        <HardRefreshButton light={light} />
      </div>
      <p className={cn("max-w-[24rem] text-[10px] leading-snug", light ? "text-white/70" : "text-muted")}>
        Theme <span className="font-semibold text-heading">{themeMeta?.label}</span> — {themeMeta?.blurb}. Background{" "}
        <span className="font-semibold text-ink">{bgMeta?.label}</span> — {bgMeta?.blurb}.
      </p>
    </div>
  );
}