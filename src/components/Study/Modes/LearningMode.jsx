// src/components/LearningMode.jsx

import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import Header from "../../General/Header";
import CardRenderer from "../Flashcards/CardRenderer";
import { selectAllCards, updateCard } from "../../../slices/cardSlice";
import { recordStudyActivity } from "../../../slices/deckSlice";
import { getUpdatedCard } from "../../../helpers/getUpdatedCard";

// Constants for Learning Mode
const LEARN_LIMIT = 5;
const LEARN_STAGES = ["animation", "trace", "draw"];

const LearningMode = ({ activeTheme, activeDeck }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select all cards and limit to the first 5 new cards
  const allCards = useSelector(selectAllCards);

  // Memoize the specific cards for this learning session
  const cardsToLearn = useMemo(
    () => allCards.slice(0, LEARN_LIMIT),
    [allCards]
  );

  // State to track progress through the learning stages
  const [cardIndex, setCardIndex] = useState(0); // Index of the current unique card (0 to 4)
  const [stageIndex, setStageIndex] = useState(0); // Index of the current stage (0 to 2)

  const [sessionLearned, setSessionLearned] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0); // Total number of stages completed

  // The current card being displayed (takes into account both indices)
  const currentCard = cardsToLearn[cardIndex];
  const currentStage = LEARN_STAGES[stageIndex];

  // The total number of steps in the session: 5 cards * 3 stages = 15 steps
  const totalSteps = LEARN_LIMIT * LEARN_STAGES.length;

  /** 🧭 Navigation */
  const exitStudy = () => {
    // Record study activity before navigating away
    dispatch(
      recordStudyActivity({
        deckId: activeDeck.id,
        learnCount: sessionLearned,
        reviewCount: 0, // No review activity in learning mode
      })
    );
    navigate("/decks");
  };

  /** ➡️ Handle Continue Button */
  const handleContinue = async () => {
    // 1. Advance the counters
    setReviewedCount((c) => c + 1);

    // 2. Check if a stage transition is needed
    if (cardIndex < LEARN_LIMIT - 1) {
      // Move to the next unique card within the current stage
      setCardIndex((i) => i + 1);
    } else if (stageIndex < LEARN_STAGES.length - 1) {
      // Reset card index, move to the next stage
      setCardIndex(0);
      setStageIndex((i) => i + 1);
    } else {
      // All stages for all cards are complete (End of session)

      // Update ALL 5 cards to "learned" status after completing the session
      for (const card of cardsToLearn) {
        // Use an "easy" rating to immediately push the card into a regular SRS schedule
        const updatedCard = getUpdatedCard(card, "easy");

        try {
          // Attempt backend update
          await fetch(`http://localhost:5000/cards/${card.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedCard),
          });
        } catch (err) {
          console.warn(`💡 Offline update for learned card ${card.id}.`);
        }

        // Update in Redux (important for sessionLearned count and next review)
        dispatch(updateCard(updatedCard));
      }

      // Update session learned count
      setSessionLearned(LEARN_LIMIT);

      // Exit the session
      exitStudy();
    }
  };

  /** 📊 Progress */
  const progressPercentage = totalSteps
    ? ((reviewedCount / totalSteps) * 100).toFixed(1)
    : 0;

  // =======================
  // 🧱 Render Logic
  // =======================

  if (!cardsToLearn.length) {
    // This state means the user is caught up on new characters
    return (
      <div
        className={`h-screen flex flex-col items-center justify-center ${activeTheme.background.app} text-center`}
      >
        <h3
          className={`text-2xl font-semibold mb-3 ${activeTheme.text.primary}`}
        >
          🎉 No new cards to learn!
        </h3>
        <button
          onClick={exitStudy}
          className={`flex items-center ${activeTheme.text.muted} hover:${activeTheme.text.primary} transition-colors duration-200`}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 mr-2" />
          Select another deck
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${activeTheme.background.app} ${activeTheme.text.primary} w-full`}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
        <Header title={`${activeDeck.name}`} />

        {/* --- Top Bar --- */}
        <header className="flex justify-between items-center mb-10">
          <button
            onClick={exitStudy}
            className={`flex items-center ${activeTheme.text.muted} hover:${activeTheme.text.primary} transition-colors duration-200`}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5 mr-2" />
            Exit Learning
          </button>

          {/* Progress Bar */}
          <div className="flex flex-col items-center flex-grow mx-4">
            <p className={`${activeTheme.text.muted} text-sm mb-2`}>
              {reviewedCount + 1} of {totalSteps} steps
            </p>
            <div className="w-full max-w-xl bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full bg-gradient-to-r ${activeTheme.gradients.from} ${activeTheme.gradients.to}`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="w-32"></div>
        </header>

        {/* --- Card Renderer --- */}
        <div
          className={`relative perspective-1000 w-full max-w-2xl mx-auto h-96 mb-8`}
        >
          <CardRenderer
            card={currentCard}
            studyMode={activeDeck.studyMode}
            activeTheme={activeTheme}
            onContinue={handleContinue}
            // step={}
          />
        </div>

        {/* Simplified button for learning mode */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            className={`px-8 py-3 text-lg font-bold rounded-xl shadow-lg transition-transform transform hover:scale-105 ${activeTheme.background.accent} ${activeTheme.text.onAccent}`}
          >
            Continue ({cardIndex + 1}/{LEARN_LIMIT})
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningMode;
