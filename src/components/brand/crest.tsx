export function Crest({ className, light = false }: { className?: string; light?: boolean }) {
  const ink = light ? "#F3F5F8" : "currentColor";
  const ring = light ? "#9EB6CE" : "currentColor";
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="none" stroke={ink} strokeWidth="2" />
      <ellipse cx="32" cy="32" rx="18" ry="7" fill="none" stroke={ring} strokeWidth="1.6" />
      <ellipse
        cx="32"
        cy="32"
        rx="18"
        ry="7"
        fill="none"
        stroke={ring}
        strokeWidth="1.6"
        transform="rotate(60 32 32)"
      />
      <ellipse
        cx="32"
        cy="32"
        rx="18"
        ry="7"
        fill="none"
        stroke={ring}
        strokeWidth="1.6"
        transform="rotate(-60 32 32)"
      />
      <circle cx="32" cy="32" r="4.2" fill={ink} />
    </svg>
  );
}

export function Wordmark({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`flex min-w-0 items-center gap-2.5 ${light ? "text-white" : "text-heading"}`}>
      <Crest className={compact ? "h-8 w-8" : "h-9 w-9"} light={light} />
      <div className="min-w-0 leading-tight">
        <div
          className={`font-display text-[15px] font-semibold tracking-tight ${light ? "text-white" : "text-heading"}`}
        >
          LMS
        </div>
        {compact ? null : (
          <div className={`text-[10px] tracking-[0.16em] uppercase ${light ? "text-white/60" : "text-muted"}`}>
            Learning Management System
          </div>
        )}
      </div>
    </div>
  );
}
