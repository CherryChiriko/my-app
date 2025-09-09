// src/components/CardRenderer.jsx
import React from "react";

const CardRenderer = ({ card, studyMode, showAnswer, activeTheme }) => {
  switch (studyMode) {
    case "A": // foreign word -> translation
      return (
        <div className="relative w-full h-full perspective">
          <div
            className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
              showAnswer ? "rotate-y-180" : "rotate-y-0"
            }`}
          >
            {/* Front */}
            <div
              className={`absolute inset-0 backface-hidden rounded-lg ${activeTheme.card.bg} p-8 flex justify-center items-center`}
            >
              <span
                className={`text-6xl font-bold ${activeTheme.text.primary}`}
              >
                {card.front}
              </span>
            </div>
            {/* Back */}
            <div
              className={`absolute inset-0 backface-hidden rotate-y-180 rounded-lg ${activeTheme.card.bg} p-8 flex justify-center items-center`}
            >
              <p className={`text-3xl ${activeTheme.text.secondary}`}>
                {card.back}
              </p>
            </div>
          </div>
        </div>
      );

    case "B": // multiple choice
      return (
        <div
          className={`w-full h-full rounded-lg ${activeTheme.card.bg} p-8 flex flex-col justify-center items-center`}
        >
          <p className="text-2xl">[Multiple choice UI goes here]</p>
        </div>
      );

    case "C": // character + reading -> meaning
      return (
        <div className="relative w-full h-full perspective">
          <div
            className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
              showAnswer ? "rotate-y-180" : "rotate-y-0"
            }`}
          >
            {/* Front */}
            <div
              className={`absolute inset-0 backface-hidden ${activeTheme.card.bg} p-8 flex flex-col justify-center items-center`}
            >
              <span className={`text-8xl ${activeTheme.text.primary}`}>
                {card.front}
              </span>
              <p className={`text-3xl ${activeTheme.text.secondary}`}>
                [{card.reading}]
              </p>
            </div>
            {/* Back */}
            <div
              className={`absolute inset-0 backface-hidden rotate-y-180 ${activeTheme.card.bg} p-8 flex justify-center items-center`}
            >
              <p className={`text-2xl ${activeTheme.text.primary}`}>
                {card.back}
              </p>
            </div>
          </div>
        </div>
      );

    // You’d add D, E, F in the same style

    default:
      return null;
  }
};

export default CardRenderer;
