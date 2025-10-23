import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import Header from "./General/Header";
import CardRenderer from "./CardRenderer";
import { getUpdatedCard } from "../helpers/getUpdatedCard";
import {
  fetchCardsByDeckId,
  selectAllCards,
  selectCardsStatus,
  selectCardsError,
} from "../slices/cardSlice";
import { selectActiveTheme } from "../slices/themeSlice";
import { selectActiveDeck } from "../slices/deckSlice";
import { updateCard } from "../slices/cardSlice";

const StudySession = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const activeTheme = useSelector(selectActiveTheme);
  const activeDeck = useSelector(selectActiveDeck);

  const cards = useSelector(selectAllCards);
  const status = useSelector(selectCardsStatus);
  const error = useSelector(selectCardsError);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentCard = cards[currentIndex];
  const totalCards = cards.length;

  /** 🧠 Fetch due cards from backend */

  useEffect(() => {
    if (activeDeck) {
      dispatch(fetchCardsByDeckId(activeDeck.id));
    }
  }, [activeDeck?.id, dispatch]);

  /** 🧭 Navigation */
  const exitStudy = () => {
    navigate("/decks");
  };

  /** 🔍 Reveal Answer */
  const handleReveal = () => setShowAnswer(true);

  const handleNextCard = () => {
    setShowAnswer(false);
    setReviewedCount((count) => count + 1);
    if (currentIndex + 1 < totalCards) {
      setCurrentIndex((i) => i + 1);
    } else {
      navigate("/decks");
    }
  };

  /** 💬 Handle rating (“again”, “hard”, “good”, “easy”) */
  const handleRate = async (rating) => {
    if (!currentCard) return;

    try {
      let updatedCard;

      // Try backend update first
      const res = await fetch(`http://localhost:5000/cards/${currentCard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getUpdatedCard(currentCard, rating)),
      });

      if (res.ok) {
        updatedCard = await res.json();
        console.log("✅ Card updated on backend:", updatedCard);
      } else {
        console.warn("⚠️ Backend update failed, using local SRS.");
        updatedCard = getUpdatedCard(currentCard, rating);
      }

      // Update in Redux (keeps UI in sync)
      dispatch(updateCard(updatedCard));

      // Optionally: if you want to persist even offline sessions,
      // you can call a thunk to save it when backend is available again:
      // dispatch(saveUpdatedCard(updatedCard));
    } catch (err) {
      console.warn("💡 Offline mode: using local SRS fallback.", err);
      const updatedCard = getUpdatedCard(currentCard, rating);
      dispatch(updateCard(updatedCard));
    }

    // Move to next card (depends on your component structure)
    handleNextCard();
  };

  /** 📊 Progress */
  const progressPercentage = totalCards
    ? ((reviewedCount / totalCards) * 100).toFixed(1)
    : 0;

  // =======================
  // 🧱 Render
  // =======================
  if (status === "loading") {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${activeTheme.background.app} ${activeTheme.text.primary}`}
      >
        <p>Loading cards...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${activeTheme.background.app} ${activeTheme.text.primary}`}
      >
        <p>{error || "Failed to load cards."}</p>
      </div>
    );
  }

  if (!activeDeck) {
    return (
      <div
        className={`${activeTheme.background.secondary} text-center py-16 rounded-xl shadow-xl border ${activeTheme.border.dashed}`}
      >
        <h3
          className={`text-2xl font-semibold mb-3 ${activeTheme.text.primary}`}
        >
          Select a deck to start studying
        </h3>
      </div>
    );
  }
  console.log(activeDeck);
  if (!cards.length) {
    return (
      <div
        className={`h-screen flex items-center justify-center ${activeTheme.background.secondary} text-center`}
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
        <Header title={activeDeck.title} description={activeDeck.description} />

        {/* === Top Bar === */}
        <header className="flex justify-between items-center mb-10">
          <button
            onClick={exitStudy}
            className={`flex items-center ${activeTheme.text.muted} hover:${activeTheme.text.primary} transition-colors duration-200`}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5 mr-2" />
            Exit Study
          </button>

          {/* Progress Bar */}
          <div className="flex flex-col items-center flex-grow mx-4">
            <p className={`${activeTheme.text.muted} text-sm mb-2`}>
              {reviewedCount + 1} of {totalCards}
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

        {/* === Card Renderer === */}
        <div
          className={`relative perspective-1000 w-full max-w-2xl mx-auto h-96 mb-8`}
        >
          <CardRenderer
            card={currentCard}
            studyMode="A"
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

export default StudySession;
