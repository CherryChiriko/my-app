// src/components/CardRenderer.jsx (Modified)
import React from "react";
import CharacterCard from "./CharacterCard";
import FlipCard from "./FlipCard";

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
  if (studyMode === "C") {
    return (
      <CharacterCard
        card={card}
        activeTheme={activeTheme}
        showAnswer={showAnswer}
        onReveal={onReveal}
        onRate={onRate}
        getRatingFromMistakes={getRatingFromMistakes}
      />
    );
  }

  return (
    <FlipCard
      card={card}
      activeTheme={activeTheme}
      showAnswer={showAnswer}
      onReveal={onReveal}
      onRate={onRate}
    />
  );
};

export default CardRenderer;
