import { Bar } from "../General/ui/Bar";

export const XPBar = ({ totalXP = 0, activeTheme }) => {
  const level = Math.floor(Math.sqrt(totalXP / 10));
  const xpForLevel = (level + 1) ** 2 * 10;
  const xpThisLevel = totalXP - level ** 2 * 10;
  const pct = Math.min(100, Math.round((xpThisLevel / xpForLevel) * 100));

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${activeTheme.background.accent}`}
          >
            <span className="font-semibold">Lv</span>
          </div>
          <div>
            <div className="text-sm opacity-80">Progress to next level</div>
            <div className="text-lg font-bold">Level {level}</div>
          </div>
        </div>
        <div className="text-sm opacity-70">{totalXP} XP</div>
      </div>

      <Bar
        trackColor={activeTheme.background.progressTrack}
        height="h-3"
        segments={[
          {
            widthPct: pct,
            color: `linear-gradient(90deg, ${activeTheme.gradients.fromHex}, ${activeTheme.gradients.toHex})`,
          },
        ]}
      />

      <div className="mt-2 text-xs opacity-70">
        {xpThisLevel}/{xpForLevel} XP ({pct}%)
      </div>
    </div>
  );
};
