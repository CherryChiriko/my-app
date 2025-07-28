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
import Header from "./Header";
import cards from "../data/cards";

const StudySession = () => {
  const activeTheme = useSelector(selectActiveTheme);
  const navigate = useNavigate();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [accuracyScore, setAccuracyScore] = useState(90); // Mock accuracy
  const audioRef = useRef(null); // Ref for audio element

  const currentCard = cards[currentCardIndex];
  const totalCards = cards.length;

  // Effect to handle audio auto-play when a new card appears
  useEffect(() => {
    if (currentCard && audioRef.current) {
      // In a real app, you would set audioRef.current.src = currentCard.audioUrl;
      // For now, just simulate playback
      console.log(
        `Playing audio for: ${currentCard.character} (${currentCard.audioUrl})`
      );
      // audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  }, [currentCardIndex, currentCard]); // Re-run when card changes

  const handleNextCard = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex((prevIndex) => prevIndex + 1);
      setShowAnswer(false); // Reset for next card
    } else {
      // End of session
      console.log("Study session complete!");
      // You might navigate to a summary page here
      navigate("/decks"); // Navigate back to decks for now
    }
  };

  const handleRating = (rating) => {
    console.log(`Card "${currentCard.character}" rated as: ${rating}`);
    setReviewedCount((prev) => prev + 1);
    // Simulate accuracy change based on rating (very basic)
    if (rating === "good" || rating === "easy") {
      setAccuracyScore((prev) => Math.min(100, prev + 2));
    } else if (rating === "again" || rating === "hard") {
      setAccuracyScore((prev) => Math.max(0, prev - 5));
    }
    handleNextCard();
  };

  const playAudio = () => {
    if (currentCard) {
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

          {/* Central Progress Area */}
          <div className="flex flex-col items-center flex-grow mx-4">
            {" "}
            {/* flex-grow to take available space, mx-4 for spacing */}
            <p className={`${activeTheme.text.muted} text-sm mb-2`}>
              {" "}
              {/* Text above the bar */}
              {currentCardIndex + 1} of {totalCards}
            </p>
            <div
              className={`w-full max-w-2xl ${activeTheme.progress.track} rounded-full h-2.5 overflow-hidden`}
            >
              {" "}
              {/* Progress bar container */}
              <div
                className={`h-2.5 rounded-full bg-gradient-to-r ${activeTheme.gradients.from} ${activeTheme.gradients.to}`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Right-aligned stats */}
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

        {/* Main Card Area */}
        <div
          className={`relative perspective-1000 w-full max-w-2xl mx-auto h-96 mb-8`}
        >
          {" "}
          {/* Added perspective and max-w-2xl, mx-auto */}
          <div
            className={`relative w-full h-full text-center transition-transform duration-700 preserve-3d rounded-lg shadow-2xl`}
            style={{
              transform: showAnswer ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Card Front */}
            <div
              className={`absolute w-full h-full backface-hidden rounded-lg ${activeTheme.card.bg} p-8 flex flex-col justify-center items-center`}
            >
              <span
                className={`text-8xl font-bold ${activeTheme.text.primary} mb-4`}
              >
                {currentCard?.character}
              </span>
              <button
                onClick={playAudio}
                className={`p-3 rounded-full ${activeTheme.button.secondaryBg} ${activeTheme.button.secondaryHover} ${activeTheme.text.activeButton} transition-colors duration-200`}
                aria-label="Replay audio"
              >
                <FontAwesomeIcon icon={faVolumeUp} className="h-6 w-6" />
              </button>
            </div>

            {/* Card Back */}
            <div
              className={`absolute w-full h-full backface-hidden rounded-lg ${activeTheme.card.bg} p-8 flex flex-col justify-center items-center rotate-y-180`}
            >
              <p
                className={`text-6xl font-bold ${activeTheme.text.primary} mb-4`}
              >
                {currentCard?.character}
              </p>
              <p className={`text-3xl ${activeTheme.text.secondary} mb-2`}>
                [{currentCard?.reading}]
              </p>
              <p className={`text-2xl ${activeTheme.text.primary} mb-4`}>
                {currentCard?.meaning}
              </p>
              <button
                onClick={playAudio}
                className={`p-3 rounded-full ${activeTheme.button.secondaryBg} ${activeTheme.button.secondaryHover} ${activeTheme.text.activeButton} transition-colors duration-200`}
                aria-label="Replay audio"
              >
                <FontAwesomeIcon icon={faVolumeUp} className="h-6 w-6" />
              </button>
            </div>
          </div>
          {/* Reveal Answer Button (visible only when answer is hidden) */}
          {!showAnswer && (
            <button
              onClick={revealAnswer}
              className={`absolute bottom-8 left-1/2 transform -translate-x-1/2
              px-6 py-3 rounded-full font-semibold ${activeTheme.button.primaryBg} ${activeTheme.button.primaryHover} ${activeTheme.text.activeButton}
              transition-all duration-300 shadow-lg hover:shadow-xl`}
            >
              <FontAwesomeIcon icon={faEye} className="w-5 h-5 mr-2" />
              Reveal Answer
            </button>
          )}
          {/* Rating Buttons (visible only when answer is shown) */}
          {showAnswer && (
            <div className="absolute bottom-8 w-full flex justify-center space-x-4 px-8">
              <button
                onClick={() => handleRating("again")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 shadow-md`}
              >
                <FontAwesomeIcon icon={faFaceTired} className="w-5 h-5 mr-2" />{" "}
                Again
              </button>
              <button
                onClick={() => handleRating("hard")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold bg-orange-600 hover:bg-orange-700 text-white transition-colors duration-200 shadow-md`}
              >
                <FontAwesomeIcon icon={faFaceFrown} className="w-5 h-5 mr-2" />{" "}
                Hard
              </button>
              <button
                onClick={() => handleRating("good")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 shadow-md`}
              >
                <FontAwesomeIcon icon={faFaceSmile} className="w-5 h-5 mr-2" />{" "}
                Good
              </button>
              <button
                onClick={() => handleRating("easy")}
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

        {/* Hidden audio element for playback */}
        <audio ref={audioRef} preload="auto" />
      </div>
    </div>
  );
};

export default StudySession;
