import React, { useMemo } from "react";

export const Heatmap = ({ data = [], activeTheme }) => {
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
    const v = map.get(iso) || 0;
    cells.push({ iso, v });
  }

  const getColor = (v) => {
    if (v === 0) return activeTheme.background.canvas || "#111827";
    if (v < 3) return activeTheme.background.accent1 || "#86efac";
    if (v < 7) return activeTheme.background.accent2 || "#facc15";
    return activeTheme.background.danger || "#fb7185";
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
            title={`${c.iso}: ${c.v} reviews`}
            style={{ background: getColor(c.v) }}
          />
        ))}
      </div>
      <div className="text-xs opacity-60">Darker = more activity</div>
    </div>
  );
};
