import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectHeatmapData } from "../../slices/activitySlice";

// Weekday labels (Mon–Sun)
const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Generate grid aligned to full weeks
function generateCalendarGrid(dataMap, days = 28) {
  const today = new Date();
  const start = new Date();
  start.setDate(today.getDate() - (days - 1));

  const startWeekday = (start.getDay() + 6) % 7; // convert Sunday=0 to Monday=0
  const gridStart = new Date(start);
  gridStart.setDate(start.getDate() - startWeekday);

  const cells = [];

  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);

    if (isNaN(d.getTime())) {
      cells.push({ date: null, iso: null, value: 0 });
      continue;
    }

    const iso = d.toISOString().slice(0, 10);
    const value = dataMap.get(iso) || 0;

    cells.push({
      date: d,
      iso,
      value,
    });
  }

  return cells;
}

export const Heatmap = ({ activeTheme, metricLabel = "Activity" }) => {
  const COLORS = activeTheme.gradients.colors;

  // Redux activity data: [{ date: "YYYY-MM-DD", value: number }]
  const heatmapData = useSelector(selectHeatmapData);

  const dataMap = useMemo(() => {
    const m = new Map();
    heatmapData.forEach((d) => m.set(d.date, d.value));
    return m;
  }, [heatmapData]);

  const cells = generateCalendarGrid(dataMap, 28);

  const getColor = (value) => {
    const max_value = 10;
    const nonzero_steps = COLORS.length - 1;

    if (value === 0) return COLORS[0];
    if (value >= max_value) return COLORS[nonzero_steps];

    const raw = Math.floor((value / max_value) * nonzero_steps);
    return COLORS[Math.min(nonzero_steps - 1, Math.max(0, raw)) + 1];
  };

  // Group into rows of 7 (calendar weeks)
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  // Determine month labels per week
  const monthLabelForWeek = (week) => {
    const firstValid = week.find((c) => c.date != null);
    if (!firstValid) return "";
    return firstValid.date.toLocaleString("default", { month: "short" });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{metricLabel} Heatmap</h3>
        <div className="text-xs opacity-60">last 4 weeks</div>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-8 gap-1 text-xs opacity-60 pl-7">
        {["", ...WEEKDAY_LABELS].map((label, idx) => (
          <div key={idx} className="text-center">
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-1">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="grid grid-cols-8 gap-1 items-center">
            {/* Month label */}
            <div className="text-xs opacity-60 w-7 text-right pr-1">
              {monthLabelForWeek(week)}
            </div>

            {/* 7 days */}
            {week.map((c, idx) => (
              <div
                key={idx}
                title={
                  c.iso ? `${c.iso}: ${c.value} ${metricLabel}` : "No data"
                }
                className="w-7 h-7 rounded-sm"
                style={{
                  background: c.date ? getColor(c.value) : "transparent",
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-between items-center text-xs opacity-60 pt-1">
        <span>Less</span>
        <div className="flex space-x-1">
          {COLORS.map((hex, index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};
