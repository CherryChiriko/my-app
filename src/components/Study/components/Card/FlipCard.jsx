// src/components/Study/components/Card/FlipCard.jsx
import React, { useState, useEffect, useRef } from "react";
import RatingButtons from "../Controls/RatingButtons";
import RevealButton from "../Controls/RevealButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFastForward } from "@fortawesome/free-solid-svg-icons";

const FlipCard = ({
  card,
  activeTheme,
  displayState,
  onRate,
  allowRating = false,
  onPassComplete,
  autoFlipEnabled = false,
  autoFlipDelay = 3000,
  variant = "standard",
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const timerRef = useRef(null);

  const isDemo = variant === "demo";

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    clearTimer();
    setShowAnswer(false);
  }, [card?.id]);

  useEffect(() => {
    if (!autoFlipEnabled || displayState !== "animation" || showAnswer) return;
    clearTimer();
    timerRef.current = setTimeout(() => setShowAnswer(true), autoFlipDelay);
    return clearTimer;
  }, [autoFlipEnabled, displayState, showAnswer, autoFlipDelay, card?.id]);

  useEffect(() => clearTimer, []);

  const handleReveal = () => {
    clearTimer();
    setShowAnswer(true);
  };

  const handleNext = () => {
    setShowAnswer(false);
    onPassComplete?.();
  };

  const handleRate = (rating) => {
    setShowAnswer(false);
    onRate?.(rating);
  };

  return (
    <div className="w-full h-full flex-1 min-h-0 flex items-center justify-center p-0 md:p-4">
      <div
        className={`relative w-full my-auto ${
          isDemo
            ? "h-full"
            : "max-w-2xl aspect-[4/5] max-h-full md:aspect-[16/9]"
        }`}
        style={{ perspective: "1000px" }}
      >
        <div
          className="relative w-full h-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
            transform: showAnswer ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* ─── FRONT ─── */}
          <div
            className={`absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl md:rounded-2xl ${
              activeTheme.background.secondary
            } ${
              activeTheme.border?.secondary || "border border-gray-200"
            } p-4 md:p-7 shadow-lg md:shadow-md`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {/* Header Tag */}
            <div className="flex justify-center shrink-0">
              <span
                className={`${
                  isDemo
                    ? "text-[10px]"
                    : "text-[10px] md:text-md px-3 py-1 rounded-full " +
                      (activeTheme.background.canvas || "bg-black/5")
                } uppercase tracking-[0.2em] font-bold ${activeTheme.text.muted}`}
              >
                Question
              </span>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex items-center justify-center w-full px-2 pt-4 overflow-y-auto">
              <p
                className={`font-bold ${activeTheme.text.primary} text-center break-words leading-snug ${
                  isDemo ? "text-lg md:text-xl" : "text-2xl md:text-5xl"
                }`}
              >
                {card?.front}
              </p>
            </div>

            {/* Controls */}
            <div className="shrink-0 flex items-center justify-center h-12 md:h-14 pt-2">
              {!showAnswer && displayState === "animation" && (
                <button
                  onClick={handleReveal}
                  className={`rounded-full font-semibold ${activeTheme.button.primary} ${activeTheme.text.activeButton} transition-all duration-300 shadow-md active:scale-95 px-5 py-2.5 text-xs md:px-6 md:py-3 md:text-base`}
                >
                  Show Answer
                </button>
              )}

              {!showAnswer && displayState === "quiz" && (
                <RevealButton
                  onReveal={handleReveal}
                  activeTheme={activeTheme}
                  variant={variant}
                />
              )}
            </div>
          </div>

          {/* ─── BACK ─── */}
          <div
            className={`absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl md:rounded-2xl ${
              activeTheme.background.secondary
            } ${
              activeTheme.border?.secondary || "border border-gray-200"
            } p-4 md:p-7 shadow-lg md:shadow-md`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Header Tag */}
            <div className="flex justify-center shrink-0">
              <span
                className={`${
                  isDemo
                    ? "text-[10px]"
                    : "text-[10px] md:text-md px-3 py-1 rounded-full " +
                      (activeTheme.background.canvas || "bg-black/5")
                } uppercase tracking-[0.2em] font-bold ${activeTheme.text.muted}`}
              >
                Answer
              </span>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex items-center justify-center w-full px-2 pt-4 overflow-y-auto">
              {showAnswer && (
                <p
                  className={`font-semibold ${activeTheme.text.primary} text-center break-words leading-snug ${
                    isDemo ? "text-lg md:text-xl" : "text-2xl md:text-5xl"
                  }`}
                >
                  {card?.back}
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="shrink-0 flex items-center justify-center h-12 md:h-14 pt-2">
              {showAnswer &&
                (allowRating ? (
                  <RatingButtons onRate={handleRate} variant={variant} />
                ) : (
                  <button
                    onClick={handleNext}
                    className={`inline-flex items-center rounded-full font-semibold ${activeTheme.button.secondary} ${activeTheme.text.secondary} transition-all duration-300 hover:shadow-md active:scale-95 px-5 py-2.5 text-xs md:px-6 md:py-3 md:text-base`}
                  >
                    Next
                    <FontAwesomeIcon
                      icon={faFastForward}
                      className="w-3.5 h-3.5 ml-1.5 md:w-4 md:h-4 md:ml-2"
                    />
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
