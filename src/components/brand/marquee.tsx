export function CampusMarquee({ text, compact = false }: { text: string; compact?: boolean }) {
  const line = text.trim();
  if (!line) return null;
  const doubled = `${line}   ·   ${line}   ·   `;
  return (
    <div
      className={`overflow-hidden border-b border-white/10 bg-navy text-white ${compact ? "h-8" : "h-9"}`}
      aria-label="Campus notices"
    >
      <div className="lms-marquee-track flex w-max items-center text-[11px] tracking-wide text-white/85 uppercase">
        <span className="px-6">{doubled}</span>
        <span className="px-6" aria-hidden="true">
          {doubled}
        </span>
      </div>
    </div>
  );
}
