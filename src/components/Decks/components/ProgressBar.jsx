import { Bar } from "../../General/ui/Bar";

export const ProgressBar = ({ deck, activeTheme }) => {
  const { mastered, due, cardsCount } = deck;

  const newCards = cardsCount - mastered - due;

  const masteredPct = (mastered / cardsCount) * 100 || 0;
  const duePct = (due / cardsCount) * 100 || 0;
  const newPct = (newCards / cardsCount) * 100 || 0;

  const track = activeTheme.isDark ? "bg-gray-700" : "bg-gray-200";

  return (
    <>
      <Bar
        trackColor={track}
        segments={[
          {
            widthPct: masteredPct,
            color: activeTheme.background.accent1Hex,
            title: `Mastered: ${mastered}`,
          },
          {
            widthPct: duePct,
            color: activeTheme.background.accent2Hex,
            title: `Due: ${due}`,
          },
          {
            widthPct: newPct,
            color: track,
            title: `New: ${newCards}`,
          },
        ]}
      />

      <div className="flex justify-between text-xs mt-2">
        <span className={activeTheme.text.accent1}>{mastered} mastered</span>
        <span className={activeTheme.text.accent2}>{due} due</span>
        <span className={activeTheme.text.muted}>{newCards} new</span>
      </div>
    </>
  );
};
