// src/components/StudySession.jsx
import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCard } from "../helpers/updateCard";
import { getReviewQueue } from "../helpers/getReviewQueue";
import { selectActiveTheme } from "../slices/themeSlice";
import { selectActiveDeck } from "../slices/deckSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faVolumeUp,
  faEye,
  faFaceLaughBeam,
  faFaceSmile,
  faFaceFrown,
  faFaceTired,
} from "@fortawesome/free-solid-svg-icons";
import Header from "./General/Header";
import CardRenderer from "./CardRenderer";

const StudySession = () => {
  const activeTheme = useSelector(selectActiveTheme);
  const activeDeck = useSelector(selectActiveDeck);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const audioRef = useRef(null);
  console.log("Active Deck in StudySession:", activeDeck);
  const cards = activeDeck?.allCards || [];

  const [reviewQueue, setReviewQueue] = useState(getReviewQueue(cards));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const currentCard = reviewQueue[currentIndex] || null;
  const totalCards = reviewQueue.length + reviewedCount;

  // Effect to handle audio auto-play when a new card appears
  useEffect(() => {
    if (currentCard && currentCard.audioUrl && audioRef.current) {
      console.log(
        `Playing audio for: ${currentCard.character} (${currentCard.audioUrl})`
      );
      // audioRef.current.src = currentCard.audioUrl;
      // audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  }, [currentCard]);

  const handleNextCard = () => {
    setShowAnswer(false);
    setReviewedCount((count) => count + 1);

    if (currentIndex + 1 < reviewQueue.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      navigate("/decks");
    }
  };

  const handleRating = (rating) => {
    // 1. Calculate the updated card properties using the SRS algorithm
    const updatedCard = getUpdatedCard(currentCard, rating);

    // 2. Dispatch the updateCard action to save the changes to the Redux store
    dispatch(updateCard(updatedCard));

    // 3. Proceed to the next card
    handleNextCard();
  };

  const getUpdatedCard = (card, rating) => {
    // This is the function with the SRS logic you provided.
    // It takes the card and rating and returns a new card object with updated properties.
    // Ensure you have this function defined or imported.
    let newInterval = 0;
    let newEase = card.ease;
    let newLapses = card.lapses;

    switch (rating) {
      case "again":
        newInterval = 1;
        newEase = Math.max(1.3, newEase - 0.2);
        newLapses = newLapses + 1;
        break;
      case "hard":
        newInterval = card.interval > 0 ? card.interval * 1.2 : 2;
        break;
      case "good":
        newInterval = card.interval > 0 ? card.interval * newEase : 4;
        break;
      case "easy":
        newInterval = card.interval > 0 ? card.interval * newEase * 1.3 : 6;
        newEase = Math.min(2.5, newEase + 0.15);
        break;
      default:
        newInterval = card.interval;
    }

    const now = new Date();
    const newDueDate = new Date(
      now.getTime() + newInterval * 24 * 60 * 60 * 1000
    );

    return {
      ...card,
      interval: newInterval,
      ease: newEase,
      lapses: newLapses,
      due: newDueDate.toISOString(),
    };
  };

  const handleClick = (rating) => {
    handleRating(rating);
  };

  const playAudio = () => {
    if (currentCard && currentCard.audioUrl) {
      console.log(
        `Replaying audio for: ${currentCard.character} (${currentCard.audioUrl})`
      );
      // audioRef.current.play().catch(e => console.error("Audio replay failed:", e));
    }
  };

  const revealAnswer = () => setShowAnswer(true);

  const exitStudy = () => {
    navigate("/decks");
  };

  const progressPercentage = (reviewedCount / totalCards) * 100;

  return (
    <div
      className={`min-h-screen ${activeTheme.background.app} ${activeTheme.text.primary} w-full`}
    >
      {!activeDeck ? (
        <div
          className={`${activeTheme.card.bg} text-center py-16 rounded-xl shadow-xl border ${activeTheme.border.dashed}`}
        >
          <div className="p-6">
            <h3
              className={`text-2xl font-semibold mb-3 ${activeTheme.text.primary}`}
            >
              You're all caught up!
            </h3>
          </div>
        </div>
      ) : (
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
          <Header
            title={`${activeDeck.title}`}
            description={`${activeDeck.description}`}
          />

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
              <div className="w-full max-w-2xl bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full bg-gradient-to-r ${activeTheme.gradients.from} ${activeTheme.gradients.to}`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </header>

          {/* Main Card Area */}
          <div
            className={`relative perspective-1000 w-full max-w-2xl mx-auto h-96 mb-8`}
          >
            <CardRenderer
              card={currentCard}
              studyMode="A" // TODO: later pull from deck settings
              showAnswer={showAnswer}
              activeTheme={activeTheme}
            />

            {/* Reveal Answer */}
            {!showAnswer && (
              <button
                onClick={revealAnswer}
                className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full font-semibold ${activeTheme.button.primary} ${activeTheme.text.activeButton} transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                <FontAwesomeIcon icon={faEye} className="w-5 h-5 mr-2" />
                Reveal Answer
              </button>
            )}

            {/* Rating Buttons */}
            {showAnswer && (
              <div className="absolute bottom-8 w-full flex justify-center space-x-4 px-8">
                <button
                  onClick={() => handleClick("again")}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 shadow-md`}
                >
                  <FontAwesomeIcon
                    icon={faFaceTired}
                    className="w-5 h-5 mr-2"
                  />
                  Again
                </button>
                <button
                  onClick={() => handleClick("hard")}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold bg-orange-600 hover:bg-orange-700 text-white transition-colors duration-200 shadow-md`}
                >
                  <FontAwesomeIcon
                    icon={faFaceFrown}
                    className="w-5 h-5 mr-2"
                  />
                  Hard
                </button>
                <button
                  onClick={() => handleClick("good")}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 shadow-md`}
                >
                  <FontAwesomeIcon
                    icon={faFaceSmile}
                    className="w-5 h-5 mr-2"
                  />
                  Good
                </button>
                <button
                  onClick={() => handleClick("easy")}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors duration-200 shadow-md`}
                >
                  <FontAwesomeIcon
                    icon={faFaceLaughBeam}
                    className="w-5 h-5 mr-2"
                  />
                  Easy
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto" />
    </div>
  );
};

export default StudySession;
