// src/components/StudySession.jsx
import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectActiveTheme } from "../slices/themeSlice";
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

import { sm2, getReviewQueue } from "../helpers/sm2";
import cards from "../data/cards";

const StudySession = () => {
  const activeTheme = useSelector(selectActiveTheme);
  const navigate = useNavigate();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [accuracyScore, setAccuracyScore] = useState(90); // Mock accuracy
  const audioRef = useRef(null); // Ref for audio element

  const [reviewQueue, setReviewQueue] = useState(getReviewQueue(cards));
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentCard = reviewQueue[currentIndex] || null;
  const totalCards = cards.length;

  // Effect to handle audio auto-play when a new card appears
  useEffect(() => {
    // Check if the card has an audioUrl before trying to play
    if (currentCard && currentCard.audioUrl && audioRef.current) {
      console.log(
        `Playing audio for: ${currentCard.character} (${currentCard.audioUrl})`
      );
      // In a real app, you would set audioRef.current.src = currentCard.audioUrl;
      // For now, just simulate playback
      // audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  }, [currentCardIndex, currentCard]);

  const handleNextCard = () => {
    const newQueue = reviewQueue.filter((_, i) => i !== currentIndex);

    setReviewQueue(newQueue);
    setCurrentCardIndex((prev) => prev + 1);
    setShowAnswer(false);
    setReviewedCount((count) => count + 1);

    // If no more cards, exit
    if (newQueue.length === 0) {
      navigate("/decks");
    }
  };

  const handleRating = (rating) => {
    const card = reviewQueue[currentIndex];

    // Map rating -> SM-2 quality
    let quality = 0;
    if (rating === "again") quality = 0;
    if (rating === "hard") quality = 3;
    if (rating === "good") quality = 4;
    if (rating === "easy") quality = 5;

    // Update scheduling
    const updatedCard = sm2(card, quality);

    // Persist updated card (localStorage/Redux/db)
    // For now we just log:
    console.log("Updated card:", updatedCard);
  };

  const handleClick = (rating) => {
    handleRating(rating);
    handleNextCard();
  };

  const playAudio = () => {
    // Only play audio if the current card has an audioUrl
    if (currentCard && currentCard.audioUrl) {
      console.log(
        `Replaying audio for: ${currentCard.character} (${currentCard.audioUrl})`
      );
      // In a real app: audioRef.current.play().catch(e => console.error("Audio replay failed:", e));
    }
  };

  const revealAnswer = () => {
    setShowAnswer(true);
  };

  const exitStudy = () => {
    console.log("Exiting study session.");
    navigate("/decks"); // Navigate back to decks page
  };

  const progressPercentage = (currentCardIndex / totalCards) * 100;

  return (
    <div
      className={`min-h-screen ${activeTheme.background.app} ${activeTheme.text.primary} w-full`}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
        <Header title="Japanese Hiragana Basics" description="" />
        <header className="flex justify-between items-center mb-10">
          <button
            onClick={exitStudy}
            className={`flex items-center ${activeTheme.text.secondary} hover:${activeTheme.text.primary} transition-colors duration-200`}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5 mr-2" />
            Exit Study
          </button>
          <div className="flex flex-col items-center flex-grow mx-4">
            <p className={`${activeTheme.text.muted} text-sm mb-2`}>
              {currentCardIndex + 1} of {totalCards}
            </p>
            <div
              className={`w-full max-w-2xl ${activeTheme.progress.track} rounded-full h-2.5 overflow-hidden`}
            >
              <div
                className={`h-2.5 rounded-full bg-gradient-to-r ${activeTheme.gradients.from} ${activeTheme.gradients.to}`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-sm ${activeTheme.text.muted}`}>
              Accuracy:{" "}
              <span
                className={`${
                  accuracyScore >= 70 ? "text-green-400" : "text-red-400"
                } font-semibold`}
              >
                {accuracyScore}%
              </span>
            </p>
          </div>
        </header>

        {/* Main Card Area - Use a single container and conditionally render content */}
        <div
          className={`relative perspective-1000 w-full max-w-2xl mx-auto h-96 mb-8`}
        >
          {" "}
          <CardRenderer
            card={currentCard}
            studyMode={"A"} // later pull from deck settings
            showAnswer={showAnswer}
            activeTheme={activeTheme}
          />
          {/* Reveal Answer Button */}
          {!showAnswer && (
            <button
              onClick={revealAnswer}
              className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full font-semibold ${activeTheme.button.primaryBg} ${activeTheme.button.primaryHover} ${activeTheme.text.activeButton} transition-all duration-300 shadow-lg hover:shadow-xl`}
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
                <FontAwesomeIcon icon={faFaceTired} className="w-5 h-5 mr-2" />{" "}
                Again
              </button>
              <button
                onClick={() => handleClick("hard")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold bg-orange-600 hover:bg-orange-700 text-white transition-colors duration-200 shadow-md`}
              >
                <FontAwesomeIcon icon={faFaceFrown} className="w-5 h-5 mr-2" />{" "}
                Hard
              </button>
              <button
                onClick={() => handleClick("good")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 shadow-md`}
              >
                <FontAwesomeIcon icon={faFaceSmile} className="w-5 h-5 mr-2" />{" "}
                Good
              </button>
              <button
                onClick={() => handleClick("easy")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors duration-200 shadow-md`}
              >
                <FontAwesomeIcon
                  icon={faFaceLaughBeam}
                  className="w-5 h-5 mr-2"
                />{" "}
                Easy
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hidden audio element for playback */}
      <audio ref={audioRef} preload="auto" />
    </div>
  );
};

export default StudySession;
