// src/components/Decks/DeckCompact.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRedo,
  faFire,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectDeck } from "../../slices/deckSlice";
import { motion } from "framer-motion";

const DeckCompact = ({ deck, activeTheme }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Determine the progress bar track background based on the active theme
  const progressBarBg = activeTheme.isDark ? "bg-gray-700" : "bg-gray-200";

  const newCards = deck.cardsCount - deck.mastered - deck.due;

  const masteredPercentage =
    deck.cardsCount > 0 ? (deck.mastered / deck.cardsCount) * 100 : 0;
  const duePercentage =
    deck.cardsCount > 0 ? (deck.due / deck.cardsCount) * 100 : 0;
  const newPercentage =
    deck.cardsCount > 0 ? (newCards / deck.cardsCount) * 100 : 0;

  // Conditional button flags
  const showLearn = newCards > 0;
  const showReview = deck.due > 0;

  const handleDeckClick = () => {
    navigate(`/decks/${deck.id}`);
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
    <motion.div
      layout
      whileHover={{
        translateY: -6,
        boxShadow: "0 10px 30px rgba(16,24,40,0.12)",
      }}
      className={`rounded-xl p-4 cursor-pointer border ${activeTheme.border.card} ${activeTheme.background.secondary} transition-all`}
      onClick={handleDeckClick}
    >
      <div className="flex items-start justify-between">
        <div className="w-1/3 flex-col">
          <span className={`font-semibold ${activeTheme.text.primary}`}>
            {deck.name}
          </span>
          <div className="flex flex-row">
            <div
              className={`${activeTheme.text.accent1} font-semibold text-sm`}
            >
              {deck.language}
            </div>
            •
            <div className={`text-xs ${activeTheme.text.muted}`}>
              {deck.cardsCount} cards
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full">
        {/* Progress Bar with distinct sections */}
        <div
          className={`w-full ${progressBarBg} rounded-full h-2.5 mb-4 overflow-hidden`}
        >
          <div
            className={`${activeTheme.background.accent1} h-2.5 float-left`}
            style={{ width: `${masteredPercentage}%` }}
            title={`Mastered: ${deck.mastered}`}
          ></div>
          <div
            className={`${activeTheme.background.accent2} h-2.5 float-left`}
            style={{ width: `${duePercentage}%` }}
            title={`Due: ${deck.due}`}
          ></div>
          <div
            className={`${progressBarBg} h-2.5 float-left`}
            style={{ width: `${newPercentage}%` }}
          ></div>
        </div>
        {/* Status Indicators */}
        <div
          className={`flex justify-between items-center ${activeTheme.text.secondary} text-sm mb-4`}
        >
          <div className="flex items-center space-x-4">
            <span className={`${activeTheme.text.muted}`}>
              {deck.mastered} Mastered
            </span>
            <span className={`${activeTheme.text.muted}`}>{deck.due} Due</span>
          </div>
        </div>

        <div className="text-right text-sm w-1/4">
          <div className={`${activeTheme.text.accent1} font-semibold`}>
            {deck.language}
          </div>
          <div className={`text-xs ${activeTheme.text.muted}`}>
            {deck.cardsCount} cards
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DeckCompact;
