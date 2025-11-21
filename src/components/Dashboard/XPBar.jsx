export const XPBar = ({ totalXP = 0, activeTheme }) => {
  // simple level formula: level = floor(sqrt(totalXP / 10))
  const level = Math.floor(Math.sqrt(totalXP / 10));
  const xpForLevel = (level + 1) ** 2 * 10;
  const xpThisLevel = totalXP - level ** 2 * 10;
  const pct = Math.max(
    0,
    Math.min(100, Math.round((xpThisLevel / xpForLevel) * 100))
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activeTheme.background.accent || "bg-indigo-500"
            }`}
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

      <div
        className="w-full bg-opacity-20 rounded-full h-3 overflow-hidden"
        style={{
          backgroundColor: activeTheme.background.progressTrack || "#2d3748",
        }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${
              activeTheme.gradients.fromHex || "#7c3aed"
            }, ${activeTheme.gradients.toHex || "#06b6d4"})`,
          }}
        />
      </div>
      <div className="mt-2 text-xs opacity-70">
        {xpThisLevel}/{xpForLevel} XP ({pct}%)
      </div>
    </div>
  );
};
