// src/components/Decks/DeckCompact.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const DeckCompact = ({ deck, activeTheme }) => {
  const navigate = useNavigate();
  const totalCards = deck.cardCount || 0;
  const masteredCards = deck.masteredCards || Math.floor(totalCards * 0.6);
  const newCards = deck.newCards || Math.floor(totalCards * 0.2);
  const progressPercentage =
    totalCards > 0 ? (masteredCards / totalCards) * 100 : 0;

  const handleDeckClick = () => {
    navigate(`/decks/${deck.id}`);
  };

  return (
    <div
      onClick={handleDeckClick}
      className={`
        ${activeTheme.background.canvas} 
        ${activeTheme.text.primary} 
        rounded-lg 
        p-4 
        shadow-sm 
        hover:shadow-md 
        transition-all 
        duration-200 
        flex 
        items-center 
        justify-between 
        cursor-pointer
        border 
        ${activeTheme.border.card}
      `}
    >
      {/* Left Section: Title, Language, and Last Studied */}
      <div className="flex-grow pr-4">
        <h3 className="text-lg font-semibold truncate mb-1" title={deck.name}>
          {deck.name}
        </h3>
        <div className="flex items-center text-sm space-x-3 opacity-80">
          <span className={`${activeTheme.text.secondary}`}>
            Language: {deck.language}
          </span>
          {deck.lastStudied && (
            <span className={`${activeTheme.text.secondary}`}>
              | Last Studied: {new Date(deck.lastStudied).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Center Section: Advancement/Progress Bar */}
      <div className="w-40 mr-4 hidden sm:block">
        {" "}
        {/* Hide on extra small screens */}
        <div className="flex justify-between text-xs mb-1">
          <span className={`${activeTheme.text.secondary}`}>
            Mastered: {masteredCards}
          </span>
          <span className={`${activeTheme.text.secondary}`}>
            Total: {totalCards}
          </span>
        </div>
        <div
          className={`w-full ${activeTheme.background.secondary} rounded-full h-2`}
        >
          <div
            className={`h-full rounded-full ${activeTheme.background.accent}`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className={`${activeTheme.text.secondary} text-green-500`}>
            New: {newCards}
          </span>
        </div>
      </div>

      {/* Right Section: Action Buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/decks/${deck.id}/study`);
          }}
          className={`
            ${activeTheme.button.primary} 
            ${activeTheme.text.primary} 
            p-2 rounded-full 
            hover:opacity-80 
            transition-opacity 
            duration-200 
            flex items-center justify-center
            hidden md:flex // Hide on small screens, show on medium and up
          `}
          title="Start Study"
        >
          <FontAwesomeIcon icon={faBookOpen} className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default DeckCompact;
