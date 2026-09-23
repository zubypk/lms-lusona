import { PHOTO_BACKGROUNDS } from "@/lib/appearance";
import { useAppearance } from "@/components/appearance/provider";

/** Dedicated paint layer so page content never sits under an opaque overlay. */
export function PageBackground() {
  const { background } = useAppearance();
  const photo = PHOTO_BACKGROUNDS[background];
  return (
    <div id="lms-page-bg" aria-hidden="true">
      {photo ? (
        <>
          <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-paper/45" />
        </>
      ) : null}
    </div>
  );
}