import React, { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faRedo,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import { ProgressBar } from "../ProgressBar";
import { formatDate } from "../../General/utils/formatDate";

const FullVariant = ({ deck, activeTheme, logic }) => {
  const { streak, showLearn, showReview, handleAction } = logic;

  return (
    <div className="p-6 w-full flex flex-col">
      {/* Deck title & streak */}
      <h3 className={`text-2xl font-bold ${activeTheme.text.primary} mb-2`}>
        {deck.name}
      </h3>

      {deck.description && (
        <p className={`${activeTheme.text.secondary} text-sm mb-3`}>
          {deck.description}
        </p>
      )}

      {/* Tags & streak */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(deck.tags || []).map((tag, i) => (
          <span
            key={i}
            className={`${activeTheme.background.app} ${activeTheme.accent} text-xs px-3 py-1 rounded-full`}
          >
            {tag}
          </span>
        ))}

        {streak > 0 && (
          <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold bg-amber-500/10 px-2 py-1 rounded-full">
            <FontAwesomeIcon icon={faFire} /> {streak}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <ProgressBar deck={deck} activeTheme={activeTheme} />

      {/* Deck info */}
      <div
        className={`flex justify-between items-center ${activeTheme.text.secondary} text-sm mt-4`}
      >
        <span>
          {deck.cardsCount} cards • {deck.language}
        </span>
        <span>Last studied: {formatDate(deck.lastStudied)}</span>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex space-x-3">
        {showLearn && (
          <button
            onClick={(e) => handleAction(e, "learn")}
            className={`${activeTheme.button.primary} ${activeTheme.text.activeButton} flex-1 py-3 rounded-lg font-semibold flex items-center justify-center`}
          >
            <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
            Learn
          </button>
        )}
        {showReview && (
          <button
            onClick={(e) => handleAction(e, "review")}
            className={`${activeTheme.button.accent} ${activeTheme.text.activeButton} flex-1 py-3 rounded-lg font-semibold flex items-center justify-center`}
          >
            <FontAwesomeIcon icon={faRedo} className="mr-2" />
            Review ({deck.due})
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(FullVariant);
