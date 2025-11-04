import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faGraduationCap,
  faRedo,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { selectDeck } from "../../slices/deckSlice";

const DeckCard = ({ deck, activeTheme }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hasStreak = deck.streak > 0 ? deck.streak : false;

  // Determine the progress bar track background based on the active theme
  const progressBarBg = activeTheme.isDark ? "bg-gray-700" : "bg-gray-200";

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

  const masteredPercentage = cardsCount > 0 ? (mastered / cardsCount) * 100 : 0;
  const duePercentage = cardsCount > 0 ? (due / cardsCount) * 100 : 0;
  const newPercentage = cardsCount > 0 ? (newCards / cardsCount) * 100 : 0;

  // Conditional button flags
  const showLearn = newCards > 0;
  const showReview = due > 0;

  console.log(deck.streak);
  console.log(deck);

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
            className={`flex-1 flex items-center justify-center space-x-2 ${activeTheme.button.accent} ${activeTheme.text.secondary} border ${activeTheme.border.card} font-semibold py-3 rounded-lg transition-colors duration-200 hover:opacity-90`}
          >
            <FontAwesomeIcon icon={faRedo} className="h-4 w-4" />
            <span>Review ({due})</span>
          </button>
        )}

        {/* Fallback if neither Learn nor Review is needed */}
        {!showLearn && !showReview && (
          <span className={`${activeTheme.button.muted}`}>Mastered</span>
        )}
      </div>
    </div>
  );
};

export default DeckCard;
