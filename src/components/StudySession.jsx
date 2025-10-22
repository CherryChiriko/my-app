// src/components/StudySession.jsx
import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { selectActiveTheme } from "../slices/themeSlice";
import { selectActiveDeck } from "../slices/deckSlice";
import { updateCard } from "../slices/cardSlice";
import { getUpdatedCard } from "../helpers/getUpdatedCard";
import { getReviewQueue } from "../helpers/getReviewQueue";
import Header from "./General/Header";
import CardRenderer from "./CardRenderer";
import cardsData from "../data/cards";

const StudySession = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activeTheme = useSelector(selectActiveTheme);
  const activeDeck = useSelector(selectActiveDeck);
  console.log("Active Deck:", activeDeck);

  const allDeckCards = useMemo(() => {
    return activeDeck
      ? cardsData.filter((c) => c.deckId === activeDeck.id)
      : [];
  }, [activeDeck]);

  const reviewQueue = useMemo(
    () => getReviewQueue(allDeckCards),
    [allDeckCards]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const totalCards = reviewQueue.length;
  const currentCard = reviewQueue[currentIndex];
  const progressPercentage = totalCards
    ? (reviewedCount / totalCards) * 100
    : 0;

  const exitStudy = () => navigate("/decks");

  const revealAnswer = () => setShowAnswer(true);

  const handleCardRating = (rating) => {
    if (!currentCard) return;

    const updatedCard = getUpdatedCard(currentCard, rating);
    dispatch(updateCard(updatedCard));

    setReviewedCount((prev) => prev + 1);
    setShowAnswer(false);

    if (currentIndex + 1 < reviewQueue.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      navigate("/decks");
    }
  };

  if (!activeDeck) {
    return (
      <div
        className={`${activeTheme.background.secondary} text-center py-16 rounded-xl shadow-xl border ${activeTheme.border.dashed}`}
      >
        <h3 className="text-2xl font-semibold mb-3">You're all caught up!</h3>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${activeTheme.background.app} ${activeTheme.text.primary} w-full`}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
        <Header title={activeDeck.name} description={activeDeck.description} />

        {/* Top Bar */}
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

        {/* Main Card Area */}
        {currentCard && (
          <div className="relative perspective-1000 w-full max-w-2xl mx-auto h-96 mb-8">
            <CardRenderer
              card={currentCard}
              studyMode="A"
              activeTheme={activeTheme}
              showAnswer={showAnswer}
              onReveal={revealAnswer}
              onRate={handleCardRating}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudySession;
