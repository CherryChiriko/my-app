import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faRedo,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { selectDeck } from "../../slices/deckSlice";

import ProgressBar from "./ProgressBar";

const DeckCard = ({ deck, activeTheme }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hasStreak = deck.streak > 0 ? deck.streak : false;

  const {
    id,
    name,
    description,
    mastered,
    due,
    tags,
    cardsCount,
    language,
    lastStudied,
  } = deck;

  const newCards = cardsCount - mastered - due;

  // Conditional button flags
  const showLearn = newCards > 0;
  const showReview = due > 0;

  const handleCardClick = () => {
    navigate(`${id}`); // Navigate to /decks/:deckId
  };

  const handleAction = (e, actionType) => {
    e.stopPropagation(); // Prevent triggering the card click
    dispatch(selectDeck(deck)); // Dispatch the selected deck

    // Navigate to a specific study mode
    if (actionType === "learn") {
      navigate("/study?mode=learn");
    } else if (actionType === "review") {
      navigate("/study?mode=review");
    }
  };

  return (
    <div
      className={`${activeTheme.background.secondary} rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer border ${activeTheme.border.card}`}
      onClick={handleCardClick}
    >
      <h3 className={`text-2xl font-bold ${activeTheme.text.primary} mb-2`}>
        {name}
      </h3>
      <p className={`${activeTheme.text.secondary} text-sm mb-3`}>
        {description}
      </p>
      {/* Tags: Using the primary app background and accent text for visibility */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`${activeTheme.background.app} ${activeTheme.accent} text-xs px-3 py-1 rounded-full font-medium`}
          >
            {tag}
          </span>
        ))}
        {hasStreak && (
          <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold bg-amber-500/10 px-2 py-1 rounded-full">
            <FontAwesomeIcon icon={faFire} /> {deck.streak}
          </div>
        )}
      </div>
      {/* Progress Bar with distinct sections */}
      <ProgressBar deck={deck} activeTheme={activeTheme} />

      {/* Footer Details */}
      <div
        className={`flex justify-between items-center ${activeTheme.text.secondary} text-sm`}
      >
        <span>
          {cardsCount} cards • {language}
        </span>
        <span>Last studied: {lastStudied}</span>
      </div>

      {/* ACTION BUTTONS (Contextual Learn and Review) */}
      <div className="mt-6 flex space-x-3">
        {showLearn && (
          <button
            onClick={(e) => handleAction(e, "learn")}
            className={`flex-1 flex items-center justify-center space-x-2 ${activeTheme.button.primary} ${activeTheme.text.activeButton} font-semibold py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl`}
          >
            <FontAwesomeIcon icon={faGraduationCap} className="h-4 w-4" />
            <span>Learn</span>
          </button>
        )}

        {showReview && (
          <button
            onClick={(e) => handleAction(e, "review")}
            className={`flex-1 flex items-center justify-center space-x-2 ${activeTheme.button.accent} ${activeTheme.text.activeButton} font-semibold py-3 rounded-lg transition-colors duration-200 hover:opacity-90`}
          >
            <FontAwesomeIcon icon={faRedo} className="h-4 w-4" />
            <span>Review ({due})</span>
          </button>
        )}

        {/* Fallback if neither Learn nor Review is needed */}
        {!showLearn && !showReview && (
          <button className={`${activeTheme.button.muted}`}>Mastered</button>
        )}
      </div>
    </div>
  );
};

export default DeckCard;
