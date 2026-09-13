export function Crest({ className, light = false }: { className?: string; light?: boolean }) {
  const ink = light ? "#F3F5F8" : "#12385A";
  const ring = light ? "#9EB6CE" : "#2A6BB0";
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

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <Crest className="h-9 w-9" light={light} />
      <div className="leading-tight">
        <div className={`font-display text-[15px] font-semibold tracking-tight ${light ? "text-white" : "text-navy"}`}>
          AEC College
        </div>
        <div className={`text-[10px] tracking-[0.16em] uppercase ${light ? "text-white/60" : "text-muted"}`}>
          lms.lusona.org
        </div>
      </div>
    </div>
  );
}
