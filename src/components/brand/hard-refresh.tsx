import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function hardRefreshNow() {
  window.location.assign(`/refresh?t=${Date.now()}`);
}

export function HardRefreshButton({
  light = false,
  className,
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(
        "h-11 gap-1.5 px-2.5 sm:px-3",
        light ? "border-white/20 bg-white/8 text-white hover:bg-white/12" : "border-line bg-surface text-ink",
        className,
      )}
      aria-label="Hard refresh LMS"
      onClick={hardRefreshNow}
    >
      <RefreshCw className="h-4 w-4" />
      <span className="text-[11px] font-medium sm:text-xs">Hard refresh</span>
    </Button>
  );
}
