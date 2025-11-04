// src/components/ReviewMode.jsx

import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import Header from "../../General/Header";
import CardRenderer from "../Flashcards/CardRenderer";
import { getUpdatedCard } from "../../../helpers/getUpdatedCard";
import { selectAllCards, updateCard } from "../../../slices/cardSlice";
import { recordStudyActivity } from "../../../slices/deckSlice";

// Set a clear limit for the review session
const REVIEW_LIMIT = 10;

const ReviewMode = ({ activeTheme, activeDeck }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select all cards and filter/limit them for the review session
  const allCards = useSelector(selectAllCards);

  // Memoize the cards to be reviewed (the first 10)
  const cards = useMemo(() => allCards.slice(0, REVIEW_LIMIT), [allCards]);
  console.log("deck ", activeDeck);
  console.log("all cards ", allCards);
  const totalCards = cards.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionReviewed, setSessionReviewed] = useState(0); // Count of successfully reviewed cards

  const currentCard = cards[currentIndex];

  /** 🧭 Navigation */
  const exitStudy = () => {
    // Record study activity before navigating away
    dispatch(
      recordStudyActivity({
        deckId: activeDeck.id,
        learnCount: 0, // No learning in review mode
        reviewCount: sessionReviewed,
      })
    );
    navigate("/decks");
  };

  /** 🔍 Reveal Answer */
  const handleReveal = () => setShowAnswer(true);

  const handleNextCard = () => {
    setShowAnswer(false);
    if (currentIndex + 1 < totalCards) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Session complete
      exitStudy();
    }
  };

  /** 💬 Handle rating (“again”, “hard”, “good”, “easy”) - with Backend Fallback */
  const handleRate = async (rating) => {
    if (!currentCard) return;

    try {
      let updatedCard;

      // 1. Calculate new card state using SRS logic
      const newCardState = getUpdatedCard(currentCard, rating);

      // 2. Attempt backend update
      const res = await fetch(`http://localhost:5000/cards/${currentCard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCardState),
      });

      if (res.ok) {
        updatedCard = await res.json();
        console.log("✅ Card updated on backend:", updatedCard);
      } else {
        console.warn("⚠️ Backend update failed, using local SRS.");
        updatedCard = newCardState;
      }

      // 3. Update Redux state
      dispatch(updateCard(updatedCard));

      // 4. Update session counter (only count successful reviews/ratings)
      setSessionReviewed((c) => c + 1);

      // 5. Move to next card
      handleNextCard();
    } catch (err) {
      console.warn("💡 Offline mode: using local SRS fallback.", err);
      const updatedCard = getUpdatedCard(currentCard, rating);
      dispatch(updateCard(updatedCard));
      setSessionReviewed((c) => c + 1);
      handleNextCard();
    }
  };

  /** 📊 Progress */
  const progressPercentage = totalCards
    ? ((currentIndex / totalCards) * 100).toFixed(1)
    : 0;

  // =======================
  // 🧱 Render Logic
  // =======================

  if (!cards.length) {
    return (
      <div
        className={`h-screen flex flex-col items-center justify-center ${activeTheme.background.app} text-center`}
      >
        <h3
          className={`text-2xl font-semibold mb-3 ${activeTheme.text.primary}`}
        >
          🎉 You're all caught up!
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
            Exit Review
          </button>
          {/* Progress Bar */}
          <div className="flex flex-col items-center flex-grow mx-4">
            <p className={`${activeTheme.text.muted} text-sm mb-2`}>
              {currentIndex + 1} of {totalCards}
            </p>
            <div className="w-full max-w-xl bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full bg-gradient-to-r ${activeTheme.gradients.from} ${activeTheme.gradients.to}`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="w-32"></div> {/* Spacer to balance 'Exit' button */}
        </header>

        {/* --- Card Renderer --- */}
        <div
          className={`relative perspective-1000 w-full max-w-2xl mx-auto h-96 mb-8`}
        >
          <CardRenderer
            card={currentCard}
            studyMode={activeDeck.studyMode}
            activeTheme={activeTheme}
            showAnswer={showAnswer}
            onReveal={handleReveal}
            onRate={handleRate}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewMode;
