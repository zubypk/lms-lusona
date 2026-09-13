import { ImageIcon, Palette } from "lucide-react";
import { BACKGROUNDS, THEMES } from "@/lib/appearance";
import { useAppearance } from "@/components/appearance/provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function AppearanceControls({ light = false }: { light?: boolean }) {
  const { theme, background, setTheme, setBackground } = useAppearance();
  const themeLabel = THEMES.find((t) => t.id === theme)?.label ?? "Theme";
  const bgLabel = BACKGROUNDS.find((b) => b.id === background)?.label ?? "Background";
  const trigger = light
    ? "border-white/20 bg-white/8 text-white hover:bg-white/12"
    : "border-line bg-surface text-ink";

  return (
    <div className="flex items-center gap-1.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={cn("h-10 gap-2 px-3", trigger)} aria-label="Change theme">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">{themeLabel}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <div className="px-2 py-1.5 text-[10px] font-medium tracking-[0.14em] text-muted uppercase">Theme</div>
          {THEMES.map((t) => (
            <DropdownMenuItem
              key={t.id}
              onSelect={() => setTheme(t.id)}
              className={cn(theme === t.id && "bg-paper-2")}
            >
              <span className="flex-1">
                <span className="block text-ink">{t.label}</span>
                <span className="block text-xs text-muted">{t.blurb}</span>
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={cn("h-10 gap-2 px-3", trigger)} aria-label="Change background">
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{bgLabel}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <div className="px-2 py-1.5 text-[10px] font-medium tracking-[0.14em] text-muted uppercase">Background</div>
          <DropdownMenuSeparator />
          {BACKGROUNDS.map((b) => (
            <DropdownMenuItem
              key={b.id}
              onSelect={() => setBackground(b.id)}
              className={cn(background === b.id && "bg-paper-2")}
            >
              {b.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
