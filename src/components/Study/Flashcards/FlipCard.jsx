// src/components/Flashcard/FlipCard.jsx
import React from "react";
import RatingButtons from "./RatingButtons";
import RevealButton from "./RevealButton";

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

const FlipCard = ({ card, activeTheme, showAnswer, onReveal, onRate }) => {
  const cardBg = activeTheme?.background?.secondary ?? "bg-white";
  const primaryText = activeTheme?.text?.primary ?? "text-black";

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
            {!showAnswer && (
              <RevealButton onReveal={onReveal} activeTheme={activeTheme} />
            )}
          </div>

          {/* BACK */}
          <div
            className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl ${cardBg} p-8 flex flex-col justify-between items-center shadow-2xl`}
          >
            {showAnswer && (
              <div className="flex flex-col justify-center items-center h-full pt-8">
                <p
                  className={`text-4xl font-semibold ${primaryText} text-center mb-4`}
                >
                  {card.back}
                </p>
              </div>
            )}
            {showAnswer && <RatingButtons onRate={onRate} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default FlipCard;
