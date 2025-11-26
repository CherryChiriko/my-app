import React from "react";

export const Bar = ({
  value = 0, // single segment (0-100)
  segments, // optional multi-segment [{ widthPct, color, title }]
  trackColor = "bg-gray-200",
  showLabel = false,
  labelClass = "text-xs text-gray-500 mt-1",
}) => {
  const isMulti = Array.isArray(segments) && segments.length > 0;
  const base = "h-2.5 rounded-full w-full overflow-hidden flex";

  return (
    <div className="w-full flex flex-col">
      <div className={`${trackColor} ${base} `}>
        {isMulti ? (
          segments.map((seg, i) => (
            <div
              key={i}
              className="h-2.5"
              style={{ width: `${seg.widthPct}%`, backgroundColor: seg.color }}
              title={seg.title}
            />
          ))
        ) : (
          <div
            className="h-2.5 rounded-full"
            style={{ width: `${Math.min(100, value)}%` }}
          />
        )}
      </div>

      {showLabel && (
        <div className={labelClass}>
          {isMulti
            ? segments.map((seg, i) => (
                <span key={i} className="mr-3">
                  {seg.title}
                </span>
              ))
            : `${value}%`}
        </div>
      )}
    </div>
  );
};
