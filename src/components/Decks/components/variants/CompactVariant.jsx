import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faRedo,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import { ProgressBar } from "../ProgressBar";

export default function CompactVariant({ deck, activeTheme, logic }) {
  const { streak, showLearn, showReview, handleCardClick, handleAction } =
    logic;

  return (
    <>
      <div className="flex flex-row justify-between mb-2">
        <span className={`text-sm font-bold ${activeTheme.text.primary}`}>
          {deck.name}
        </span>

        {streak > 0 && (
          <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold bg-amber-500/10 px-2 py-1 rounded-full">
            <FontAwesomeIcon icon={faFire} /> {streak}
          </div>
        )}
      </div>

      <ProgressBar deck={deck} activeTheme={activeTheme} />

      <div
        className={`flex justify-between items-center ${activeTheme.text.secondary} text-xs mt-3`}
      >
        <span>
          {deck.language} • {deck.cardsCount} cards
        </span>

        <div className="flex space-x-3">
          {showLearn && (
            <button
              onClick={(e) => handleAction(e, "learn")}
              className={`${activeTheme.button.primary} ${activeTheme.text.activeButton}
              w-6 h-6 rounded-full flex items-center justify-center`}
              title="Learn"
            >
              <FontAwesomeIcon icon={faGraduationCap} className="h-3 w-3" />
            </button>
          )}

          {showReview && (
            <button
              onClick={(e) => handleAction(e, "review")}
              className={`${activeTheme.button.accent} ${activeTheme.text.activeButton}
              w-6 h-6 rounded-full flex items-center justify-center`}
              title="Review"
            >
              <FontAwesomeIcon icon={faRedo} className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
