// src/components/CardRenderer.jsx (Modified)
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faFaceLaughBeam,
  faFaceSmile,
  faFaceFrown,
  faFaceTired,
  faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";
import HanziCanvas from "./HanziCanvas";

/* Minimal CSS for 3D flip (you can move to a global CSS file) */
const CardStyles = () => (
  <style jsx>{`
    .perspective {
      perspective: 1000px;
    }
    .preserve-3d {
      transform-style: preserve-3d;
    }
    .backface-hidden {
      backface-visibility: hidden;
    }
    .rotate-y-180 {
      transform: rotateY(180deg);
    }
    .rotate-y-0 {
      transform: rotateY(0deg);
    }
  `}</style>
);

/**
 * Maps mistake count to an SRS rating for the parent component.
 * @param {number} mistakes
 * @returns {"again" | "hard" | "good" | "easy"}
 */
const getRatingFromMistakes = (mistakes) => {
  if (mistakes >= 3) return "again"; // Too many mistakes
  if (mistakes === 2) return "hard";
  if (mistakes === 1) return "good";
  return "easy"; // 0 mistakes
};

const CardRenderer = ({
  card,
  studyMode = "A",
  activeTheme,
  showAnswer,
  onReveal,
  onRate,
}) => {
  const cardBg = activeTheme?.background?.secondary ?? "bg-white";
  const primaryText = activeTheme?.text?.primary ?? "text-black";

  // --- Hanzi Quiz Logic (Mode C) ---
  const [quizComplete, setQuizComplete] = React.useState(false);
  const audioRef = React.useRef(null);

  // Function to play audio (if available)
  const playAudio = () => {
    if (audioRef.current && card.audioUrl) {
      audioRef.current.play();
    }
  };

  // 1. Play audio when card first loads
  React.useEffect(() => {
    if (card.audioUrl) {
      playAudio();
    }
    // Reset state when card changes
    if (studyMode === "C") {
      setQuizComplete(false);
    }
  }, [card.id, studyMode]);

  // 2. Handle quiz completion and subsequent rating/next card
  const handleQuizComplete = (mistakesCount) => {
    setQuizComplete(true);
    // Play audio again on completion
    // playAudio();
    console.log("Mistakes ", mistakesCount);
    // Determine rating based on mistakes and call onRate
    const rating = getRatingFromMistakes(mistakesCount);

    // Call onRate after a short delay so the user can see the score
    setTimeout(() => {
      onRate(rating);
    }, 2000); // 2 second delay before moving to next card
  };

  // --- Rendering ---

  // Mode C: Hanzi Writing Quiz
  if (studyMode === "C") {
    return (
      <>
        {/* {card.audioUrl && (
          <audio ref={audioRef} src={card.audioUrl} preload="auto" />
        )} */}
        <div
          className={`w-full h-full rounded-xl ${cardBg} p-8 flex flex-col justify-between items-center shadow-2xl transition-all duration-300`}
        >
          {/* Top: Reading and Audio button */}
          <div className="w-full flex justify-between items-center mb-2">
            <div className="w-16"></div>
            <p className={`text-2xl font-semibold ${primaryText} text-center`}>
              {card.reading}
            </p>
            {card.audioUrl && (
              <button
                onClick={playAudio}
                className={`p-2 rounded-full ${
                  activeTheme?.button?.secondary ?? "bg-gray-200"
                } ${primaryText} hover:bg-gray-300 transition-colors`}
              >
                <FontAwesomeIcon icon={faVolumeHigh} className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Middle: Hanzi Quiz Canvas */}
          <div className="flex-grow w-full flex justify-center items-center">
            <HanziCanvas
              character={card.front} // The character to draw
              quizActive={!quizComplete} // Stop the quiz after completion
              onQuizComplete={handleQuizComplete}
              activeTheme={activeTheme}
            />
          </div>

          {/* Bottom: Meaning */}
          <p
            className={`text-xl ${primaryText} mt-2 me-3 mb-4 text-right font-semibold w-full`}
          >
            {card.back}
          </p>

          {/* === REVEAL BUTTON === */}
          {!showAnswer && (
            <button
              onClick={onReveal}
              className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full font-semibold ${
                activeTheme?.button?.primary ?? "bg-indigo-600"
              } ${
                activeTheme?.text?.activeButton ?? "text-white"
              } transition-all duration-300 shadow-lg hover:shadow-xl`}
            >
              <FontAwesomeIcon icon={faEye} className="w-5 h-5 mr-2" />
              Reveal Answer
            </button>
          )}
        </div>
      </>
    );
  }

  // Modes A/B: Standard Flashcard (uses the flip logic)
  return (
    <>
      <CardStyles />

      <div className="relative w-full h-full perspective">
        <div
          className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
            showAnswer ? "rotate-y-180" : "rotate-y-0"
          }`}
        >
          {/* FRONT */}
          <div
            className={`absolute inset-0 backface-hidden rounded-xl ${cardBg} p-8 flex flex-col justify-center items-center shadow-2xl`}
          >
            <span
              className={`text-6xl font-extrabold ${primaryText} text-center p-4 max-w-full`}
            >
              {/* Display card.front for Mode A/B */}
              {card.front}
            </span>

            {/* === REVEAL BUTTON === */}
            {!showAnswer && (
              <button
                onClick={onReveal}
                className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full font-semibold ${
                  activeTheme?.button?.primary ?? "bg-indigo-600"
                } ${
                  activeTheme?.text?.activeButton ?? "text-white"
                } transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                <FontAwesomeIcon icon={faEye} className="w-5 h-5 mr-2" />
                Reveal Answer
              </button>
            )}
          </div>

          {/* BACK */}
          <div
            className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl ${cardBg} p-8 flex flex-col justify-between items-center shadow-2xl`}
          >
            {/* Card answer / meaning */}
            {showAnswer && (
              <div className="flex flex-col justify-center items-center h-full pt-8">
                <p
                  className={`text-4xl font-semibold ${primaryText} text-center mb-4`}
                >
                  {card.back}
                </p>
              </div>
            )}

            {/* Rating buttons — shown only when showAnswer is true */}
            {showAnswer && (
              <div className="absolute bottom-8 w-full flex justify-center space-x-4 px-8">
                {/* ... (Rating Buttons remain the same for Mode A/B) ... */}
                <button
                  onClick={() => onRate("again")}
                  className="flex-1 px-4 py-3 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 shadow-md"
                >
                  <FontAwesomeIcon
                    icon={faFaceTired}
                    className="w-5 h-5 mr-2"
                  />
                  Again
                </button>

                <button
                  onClick={() => onRate("hard")}
                  className="flex-1 px-4 py-3 rounded-lg font-semibold bg-orange-600 hover:bg-orange-700 text-white transition-colors duration-200 shadow-md"
                >
                  <FontAwesomeIcon
                    icon={faFaceFrown}
                    className="w-5 h-5 mr-2"
                  />
                  Hard
                </button>

                <button
                  onClick={() => onRate("good")}
                  className="flex-1 px-4 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 shadow-md"
                >
                  <FontAwesomeIcon
                    icon={faFaceSmile}
                    className="w-5 h-5 mr-2"
                  />
                  Good
                </button>

                <button
                  onClick={() => onRate("easy")}
                  className="flex-1 px-4 py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors duration-200 shadow-md"
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
      </div>
    </>
  );
};

export default CardRenderer;
