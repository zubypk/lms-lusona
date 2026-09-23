export function TestFeedBanner() {
  return (
    <div className="relative z-[70] border-b border-warn/40 bg-warn-bg px-3 py-2.5 text-center text-ink">
      <p className="text-[11px] font-semibold tracking-wide sm:text-xs">
        TEST FEED · Work in progress · Under maintenance · Full LMS coming soon
      </p>
      <p className="mt-0.5 text-[10px] text-ink-soft sm:text-[11px]">
        Preview only — not the live campus site. Features may change or break.
      </p>
    </div>
  );
}
