import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faStar } from "@fortawesome/free-solid-svg-icons";

export function DeckBadges({
  isMastered,
  streak,
  activeTheme,
  //   maxStreak = streak,
}) {
  return (
    <>
      {isMastered && (
        <div
          className={`${activeTheme.text.secondary} flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full`}
        >
          <FontAwesomeIcon icon={faStar} /> Mastered
        </div>
      )}

      {!isMastered && streak > 0 && (
        <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold bg-amber-500/10 px-2 py-1 rounded-full">
          <FontAwesomeIcon icon={faFire} /> {streak}
        </div>
      )}
    </>
  );
}
