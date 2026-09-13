import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const CAMPUS_SLIDES = [
  {
    src: "/campus/exterior.jpg",
    title: "Nilore campus",
    caption: "Atomic Energy Commission College, facing the Margalla foothills.",
  },
  {
    src: "/campus/laboratory.jpg",
    title: "Physics laboratories",
    caption: "Practicals, apparatus and recorded experiments for HSSC Pre-Engineering.",
  },
  {
    src: "/campus/library.jpg",
    title: "College library",
    caption: "Reading hall, gazettes and the digital materials shelf.",
  },
  {
    src: "/campus/lecture.jpg",
    title: "Lecture theatres",
    caption: "Timetabled classes, live sessions and the academic calendar.",
  },
  {
    src: "/campus/courtyard.jpg",
    title: "Central courtyard",
    caption: "Between the academic blocks — Rawalpindi / Islamabad.",
  },
] as const;

export function HeroSlider({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const n = CAMPUS_SLIDES.length;

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % n), 5200);
    return () => window.clearInterval(id);
  }, [n]);

  function go(next: number) {
    setIndex((next + n) % n);
  }

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-navy", className)}>
      {CAMPUS_SLIDES.map((slide, i) => (
        <figure
          key={slide.src}
          className="absolute inset-0 transition-transform duration-500"
          style={{ transform: `translateX(${(index - i) * 100}%)` }}
        >
          <img src={slide.src} alt={slide.title} className="h-full w-full object-cover" draggable={false} />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
            <div className="text-[10px] tracking-[0.18em] text-white/60 uppercase">Campus</div>
            <div className="font-display text-xl font-semibold sm:text-2xl">{slide.title}</div>
            <p className="mt-1 max-w-md text-xs text-white/75 sm:text-sm">{slide.caption}</p>
          </figcaption>
        </figure>
      ))}

      <button
        type="button"
        className="absolute top-1/2 left-3 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-navy/55 text-white backdrop-blur-sm hover:bg-navy/75"
        aria-label="Previous campus photo"
        onClick={() => go(index - 1)}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        className="absolute top-1/2 right-3 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-navy/55 text-white backdrop-blur-sm hover:bg-navy/75"
        aria-label="Next campus photo"
        onClick={() => go(index + 1)}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {CAMPUS_SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            aria-label={`Show ${s.title}`}
            className={cn(
              "h-1.5 rounded-full transition-[width,background-color] duration-200",
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/45",
            )}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  );
}
