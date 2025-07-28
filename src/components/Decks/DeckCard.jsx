// src/components/DeckManager.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const DeckCard = ({ deck, activeTheme }) => {
  const navigate = useNavigate(); // Initialize useNavigate inside DeckCard

  const {
    id, // Get the deck ID for navigation
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

  return (
    <div
      className={`${activeTheme.card.bg} rounded-lg p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer`} // Added cursor-pointer
      onClick={handleCardClick} // Added onClick handler
    >
      <h3 className={`text-2xl font-bold ${activeTheme.card.text} mb-2`}>
        {name}
      </h3>
      <p className={`${activeTheme.card.description} text-sm mb-4`}>
        {description}
      </p>

      <div className="flex space-x-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`${activeTheme.card.tagBg} ${activeTheme.card.tagText} text-xs px-3 py-1 rounded-full`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Progress Bar with distinct sections */}
      <div
        className={`w-full ${activeTheme.card.progressBarBg} rounded-full h-2.5 mb-4 overflow-hidden`}
      >
        <div
          className={`${activeTheme.card.mastered} h-2.5 float-left`}
          style={{ width: `${masteredPercentage}%` }}
          title={`Mastered: ${mastered}`}
        ></div>
        <div
          className={`${activeTheme.card.learning} h-2.5 float-left`}
          style={{ width: `${learningPercentage}%` }}
          title={`Learning: ${learning}`}
        ></div>
        <div
          className={`${activeTheme.card.due} h-2.5 float-left`}
          style={{ width: `${duePercentage}%` }}
          title={`Due: ${due}`}
        ></div>
      </div>

      <div
        className={`flex justify-between items-center ${activeTheme.card.footerText} text-sm mb-4`}
      >
        <div className="flex items-center space-x-2">
          <span
            className={`${activeTheme.card.statusMasteredText} font-semibold`}
          >
            {mastered} Mastered
          </span>
          <span
            className={`${activeTheme.card.statusLearningText} font-semibold`}
          >
            {learning} Learning
          </span>
          <span className={`${activeTheme.card.statusDueText} font-semibold`}>
            {due} Due
          </span>
        </div>
      </div>

      <div
        className={`flex justify-between items-center ${activeTheme.card.footerText} text-sm`}
      >
        <span>
          {cardsCount} cards • {language}
        </span>
        <span>Last studied: {lastStudied}</span>
      </div>

      <button
        className={`mt-6 w-full ${activeTheme.button.studyBg} ${activeTheme.button.studyHover} ${activeTheme.card.tagText} font-semibold py-2 rounded-lg transition-colors duration-200`}
      >
        Study Now
      </button>
    </div>
  );
};

export default DeckCard;
