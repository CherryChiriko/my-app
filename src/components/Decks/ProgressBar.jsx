import React from "react";

const ProgressBar = ({ deck, activeTheme }) => {
  // Determine the progress bar track background based on the active theme
  const progressBarBg = activeTheme.isDark ? "bg-gray-700" : "bg-gray-200";

  const { mastered, due, cardsCount } = deck;

  const newCards = cardsCount - mastered - due;

  const masteredPercentage = cardsCount > 0 ? (mastered / cardsCount) * 100 : 0;
  const duePercentage = cardsCount > 0 ? (due / cardsCount) * 100 : 0;
  const newPercentage = cardsCount > 0 ? (newCards / cardsCount) * 100 : 0;

  return (
    <>
      <div
        className={`w-full ${progressBarBg} rounded-full h-2.5 mb-2 overflow-hidden`}
      >
        <div
          className={`${activeTheme.background.accent1} h-2.5 float-left`}
          style={{ width: `${masteredPercentage}%` }}
          title={`Mastered: ${mastered}`}
        ></div>
        <div
          className={`${activeTheme.background.accent2} h-2.5 float-left`}
          style={{ width: `${duePercentage}%` }}
          title={`Due: ${due}`}
        ></div>
        <div
          className={`${progressBarBg} h-2.5 float-left`}
          style={{ width: `${newPercentage}%` }}
        ></div>
      </div>
      {/* Status Indicators */}
      <div className="flex justify-between text-xs mb-3">
        <span className={activeTheme.text.accent1}>{mastered} mastered</span>
        <span className={activeTheme.text.accent2}>{due} due</span>
        <span className={activeTheme.text.muted}>{newCards} new</span>
      </div>
      <div></div>
    </>
  );
};

export default ProgressBar;
