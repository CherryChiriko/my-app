export const ProgressBar = ({ deck, activeTheme, isMastered }) => {
  const { mastered = 0, due = 0, cards_count = 0 } = deck;
  const newCards = Math.max(cards_count - mastered - due, 0);

  const masteredPct = cards_count ? (mastered / cards_count) * 100 : 0;
  const duePct = cards_count ? (due / cards_count) * 100 : 0;
  const newPct = cards_count ? (newCards / cards_count) * 100 : 0;

  // Base classes for the container and segments
  const baseBar = `w-full h-2.5 rounded-full overflow-hidden flex`;
  const segmentBase = `h-2.5 transition-all`;

  // Track background
  const trackClass = activeTheme.isDark ? "bg-gray-700" : "bg-gray-200";

  return (
    <div>
      <div className={`${baseBar} ${trackClass}`}>
        {masteredPct > 0 && (
          <div
            className={`${segmentBase} ${activeTheme.background.accent1}`}
            style={{ width: `${masteredPct}%` }}
            title={`Mastered: ${mastered}`}
          />
        )}
        {duePct > 0 && (
          <div
            className={`${segmentBase} ${activeTheme.background.accent2}`}
            style={{ width: `${duePct}%` }}
            title={`Due: ${due}`}
          />
        )}
        {newPct > 0 && (
          <div
            className={`${segmentBase} ${trackClass}`}
            style={{ width: `${newPct}%` }}
            title={`New: ${newCards}`}
          />
        )}
      </div>

      {!isMastered && (
        <div className="flex justify-between text-xs mt-2">
          <span className={activeTheme.text.accent1}>{mastered} mastered</span>
          <span className={activeTheme.text.accent2}>{due} due</span>
          <span className={activeTheme.text.muted}>{newCards} new</span>
        </div>
      )}
    </div>
  );
};
