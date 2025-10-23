// src/components/CardRenderer.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faFaceLaughBeam,
  faFaceSmile,
  faFaceFrown,
  faFaceTired,
} from "@fortawesome/free-solid-svg-icons";

/* Optional placeholder for HanziCanvas mode */
const HanziCanvas = () => (
  <div className="flex justify-center items-center w-full h-full text-lg text-gray-500 bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-600">
    [HanziCanvas Placeholder]
  </div>
);

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
 * Props:
 * - card: { front, back, ... }
 * - studyMode: "A" | "B" | "C"
 * - activeTheme: theme object (for classes)
 * - showAnswer: boolean (controlled by parent)
 * - onReveal: function to call when reveal button clicked
 * - onRate: function to call with rating ("again","hard","good","easy")
 */
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
  const secondaryText = activeTheme?.text?.secondary ?? "text-gray-600";

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

            {/* Rating buttons — shown only when showAnswer is true (parent controls it) */}
            {showAnswer && (
              <div className="absolute bottom-8 w-full flex justify-center space-x-4 px-8">
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
