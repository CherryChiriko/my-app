import React, { useMemo } from "react";

export const Heatmap = ({ data = [], activeTheme }) => {
  const COLORS = activeTheme.gradients.colors;

  // Map dates to values for quick lookup
  const map = useMemo(() => {
    const m = new Map();
    data.forEach((d) => m.set(d.date, d.value));
    return m;
  }, [data]);

  // Render last 28 days (4 weeks x 7)
  const days = 28;
  const cells = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const iso = date.toISOString().slice(0, 10);
    const xp = map.get(iso) || 0;
    cells.push({ iso, xp });
  }

  const getColor = (xp) => {
    const max_xp = 10;
    const nonzero_steps = COLORS.length - 1;
    let index;
    switch (xp) {
      case 0:
        index = 0;
        break;
      case xp >= max_xp:
        index = nonzero_steps;
        break;
      default:
        let raw_index = Math.floor((xp / max_xp) * nonzero_steps);
        let index_offset = Math.min(Math.max(0, raw_index), nonzero_steps - 1);
        index = index_offset + 1;
    }
    return COLORS[index];
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Study Heatmap</h3>
        <div className="text-xs opacity-60">last 4 weeks</div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((c) => (
          <div
            key={c.iso}
            className="w-7 h-7 rounded-sm"
            title={`${c.iso}: ${c.xp} XP`}
            style={{ background: getColor(c.xp) }}
          />
        ))}
      </div>
      <div className="flex justify-between items-center text-xs opacity-60 pt-1">
        <span>Less activity</span>
        <div className="flex space-x-1">
          {COLORS.map((hex, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-sm`}
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
        <span>More activity</span>
      </div>
    </div>
  );
};
