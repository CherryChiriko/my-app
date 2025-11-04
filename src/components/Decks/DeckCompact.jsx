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

  const { id, name, mastered, due, cardsCount, language } = deck;

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
      <div className="flex flex-row justify-between mb-2">
        <span className={`text-sm font-bold ${activeTheme.text.primary}`}>
          {name}
        </span>
        <div>
          {hasStreak && (
            <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold bg-amber-500/10 px-2 py-1 rounded-full">
              <FontAwesomeIcon icon={faFire} /> {deck.streak}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar with distinct sections */}
      <ProgressBar deck={deck} activeTheme={activeTheme} />

      {/* Footer Details */}
      <div
        className={`flex justify-between items-center ${activeTheme.text.secondary} text-xs mb-2`}
      >
        <span>
          {language} • {cardsCount} cards
        </span>

        {/* ACTION BUTTONS (Contextual Learn and Review) */}
        <div className="flex space-x-3">
          {showLearn && (
            <button
              onClick={(e) => handleAction(e, "learn")}
              className={`
          flex items-center justify-center 
          w-6 h-6
          rounded-full           
          ${activeTheme.button.primary} 
          ${activeTheme.text.activeButton} 
          transition-colors duration-200 
          shadow-lg hover:shadow-xl
        `}
              title="Learn New Cards"
            >
              <FontAwesomeIcon icon={faGraduationCap} className="h-3 w-3" />
            </button>
          )}

          {showReview && (
            <button
              onClick={(e) => handleAction(e, "review")}
              className={`
          flex items-center justify-center 
          w-6 h-6
          rounded-full                
          ${activeTheme.button.accent} 
          ${activeTheme.text.activeButton} 
          transition-colors duration-200 
          hover:opacity-90
        `}
              title={`Review ${due} Card(s)`}
            >
              <FontAwesomeIcon icon={faRedo} className="h-3 w-3" />
            </button>
          )}

          {/* Fallback if neither Learn nor Review is needed */}
          {!showLearn && !showReview && (
            <button className={`${activeTheme.button.muted}`}>Mastered</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeckCard;
