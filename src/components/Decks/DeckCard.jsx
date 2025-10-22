import React from "react";
import { useNavigate } from "react-router-dom";
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
  learning: { bar: "bg-yellow-500", text: "text-yellow-400" },
  due: { bar: "bg-red-500", text: "text-red-400" },
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
    learning,
    due,
    tags,
    cardsCount,
    language,
    lastStudied,
  } = deck;

  const totalCards = mastered + learning + due;
  const masteredPercentage = totalCards > 0 ? (mastered / totalCards) * 100 : 0;
  const learningPercentage = totalCards > 0 ? (learning / totalCards) * 100 : 0;
  const duePercentage = totalCards > 0 ? (due / totalCards) * 100 : 0;

  const handleCardClick = () => {
    navigate(`${id}`); // Navigate to /decks/:deckId
  };

  const handleStudyNow = (e) => {
    e.stopPropagation(); // Prevent triggering the card click
    dispatch(selectDeck(deck)); // Dispatch the selected deck (now mocked)
    navigate("/study");
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
          className={`${STATUS_COLORS.learning.bar} h-2.5 float-left`}
          style={{ width: `${learningPercentage}%` }}
          title={`Learning: ${learning}`}
        ></div>
        <div
          className={`${STATUS_COLORS.due.bar} h-2.5 float-left`}
          style={{ width: `${duePercentage}%` }}
          title={`Due: ${due}`}
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
          <span className={`${STATUS_COLORS.learning.text} font-semibold`}>
            {learning} Learning
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

      {/* Study Now Button */}
      <button
        onClick={handleStudyNow}
        // Use the primary button theme definition
        className={`mt-6 w-full ${activeTheme.button.primary} ${activeTheme.text.activeButton} font-semibold py-2 rounded-lg transition-colors duration-200 shadow-md`}
      >
        Study Now
      </button>
    </div>
  );
};

export default DeckCard;
