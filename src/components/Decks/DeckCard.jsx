import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faGraduationCap,
  faRedo,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
// The builder is failing to resolve 'react-redux' and local slices, so we must mock these dependencies.
// import { useDispatch } from "react-redux";
// import { selectDeck } from "../../slices/deckSlice";

// ======================================================================
// TEMPORARY MOCKS FOR COMPILATION STABILITY
// ======================================================================
// Mock useDispatch: returns a function that does nothing
const useDispatch = () => (action) =>
  console.log("Mock Dispatch (Redux not available):", action);

// Mock selectDeck: placeholder function for the Redux action creator
const selectDeck = (deck) => ({ type: "MOCK_SELECT_DECK", payload: deck });

// Define consistent status colors for progress bar and text,
// ensuring SRS feedback (Mastered/Learning/Due) is clear regardless of the theme.
const STATUS_COLORS = {
  mastered: { bar: "bg-green-500", text: "text-green-400" },
  due: { bar: "bg-red-500", text: "text-red-400" },
  new: { bar: "bg-gray-500" },
};
// ======================================================================

const DeckCard = ({ deck, activeTheme }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      navigate("/study?mode=due");
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
      <p className={`${activeTheme.text.secondary} text-sm mb-4`}>
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
      </div>

      {/* Progress Bar with distinct sections */}
      <div
        className={`w-full ${progressBarBg} rounded-full h-2.5 mb-4 overflow-hidden`}
      >
        <div
          className={`${STATUS_COLORS.mastered.bar} h-2.5 float-left`}
          style={{ width: `${masteredPercentage}%` }}
          title={`Mastered: ${mastered}`}
        ></div>
        <div
          className={`${STATUS_COLORS.due.bar} h-2.5 float-left`}
          style={{ width: `${duePercentage}%` }}
          title={`Due: ${due}`}
        ></div>
        <div
          className={`${STATUS_COLORS.new.bar} h-2.5 float-left`}
          style={{ width: `${newPercentage}%` }}
        ></div>
      </div>

      {/* Status Indicators */}
      <div
        className={`flex justify-between items-center ${activeTheme.text.secondary} text-sm mb-4`}
      >
        <div className="flex items-center space-x-4">
          <span className={`${STATUS_COLORS.mastered.text} font-semibold`}>
            {mastered} Mastered
          </span>
          <span className={`${STATUS_COLORS.due.text} font-semibold`}>
            {due} Due
          </span>
        </div>
      </div>

      {/* Footer Details */}
      <div
        className={`flex justify-between items-center ${activeTheme.text.secondary} text-sm`}
      >
        <span>
          {cardsCount} cards • {language}
        </span>
        <span>Last studied: {lastStudied}</span>
      </div>

      {/* Streak UI */}
      {deck.streak > 0 && (
        <div className="mt-2 flex items-center text-sm font-semibold">
          <FontAwesomeIcon icon={faFire} className="text-orange-500 mr-2" />
          <span className={`${activeTheme.text.primary}`}>
            {deck.streak}-day streak 🔥
          </span>
        </div>
      )}

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
            className={`flex-1 flex items-center justify-center space-x-2 ${activeTheme.button.secondary} ${activeTheme.text.secondary} border ${activeTheme.border.card} font-semibold py-3 rounded-lg transition-colors duration-200 hover:opacity-90`}
          >
            <FontAwesomeIcon icon={faRedo} className="h-4 w-4" />
            <span>Review ({due})</span>
          </button>
        )}

        {/* Fallback button if neither Learn nor Review is needed */}
        {!showLearn && !showReview && (
          <button
            onClick={(e) => handleAction(e, "default")}
            className={`w-full flex items-center justify-center space-x-2 ${activeTheme.button.secondary} ${activeTheme.text.secondary} font-semibold py-3 rounded-lg transition-colors duration-200 opacity-60 cursor-default`}
          >
            <FontAwesomeIcon icon={faBookOpen} className="h-4 w-4" />
            <span>All Cards Mastered! 🎉</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DeckCard;
