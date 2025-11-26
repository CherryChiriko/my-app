export const Bar = ({
  segments, // [{ color, widthPct, title }]
  height = "h-2.5",
  rounded = "rounded-full",
  trackColor,
}) => {
  return (
    <div
      className={`w-full ${trackColor} ${rounded} ${height} overflow-hidden flex`}
    >
      {segments.map((s, i) => (
        <div
          key={i}
          className={height}
          style={{ width: `${s.widthPct}%`, backgroundColor: s.color }}
          title={s.title}
        />
      ))}
    </div>
  );
};
