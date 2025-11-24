import { useState, useMemo, useCallback, useEffect, useRef } from "react";

export function useCharacterFlow({
  card,
  allowRating,
  onRate,
  onPassComplete,
  getRatingFromMistakes,
  onReveal,
  playAudio,
  displayState,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [mistakeList, setMistakeList] = useState([]);
  const [completedChars, setCompletedChars] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  // Use ref to track timeout for cleanup
  const timeoutRef = useRef(null);

  const characters = useMemo(
    () => (card?.front || "").split(""),
    [card?.front]
  );

  const currentCharacter = characters[currentIndex];

  const strokeColor = useMemo(() => {
    const toneColors = ["#777777", "#E30000", "#02B31C", "#1510F0", "#8900BF"];
    const toneIdx = card?.tones?.[currentIndex] ?? 0;
    return toneColors[toneIdx];
  }, [card?.tones, currentIndex]);

  console.log("[useCharacterFlow] STATE", {
    currentCharacter,
    currentIndex,
    displayState,
    revealed,
    showAnswer,
  });

  // Reset when card changes
  useEffect(() => {
    setCurrentIndex(0);
    setRevealed(false);
    setMistakeList([]);
    setCompletedChars([]);
    setShowAnswer(false);
    playAudio?.();
  }, [card?.id, playAudio]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const isLastCharacter = currentIndex === characters.length - 1;

  const calculateAverage = useCallback(
    (mistakesForCurrentChar) => {
      const allMistakes = [...mistakeList, mistakesForCurrentChar];
      return allMistakes.reduce((a, b) => a + b, 0) / allMistakes.length;
    },
    [mistakeList]
  );

  const handleAdvanceCharacter = useCallback(() => {
    setCurrentIndex((i) => i + 1);
    setRevealed(false);
    setShowAnswer(false);
  }, []);

  const renderWordProgress = () => {
    return (
      <div className="flex space-x-2 text-2xl justify-center items-center">
        {characters.map((ch, idx) => {
          if (displayState === "quiz") {
            const isRevealed = idx < completedChars.length;
            return (
              <span
                key={idx}
                className={`transition-all duration-300 ${
                  isRevealed ? "opacity-100" : "opacity-20"
                }`}
              >
                {isRevealed ? ch : "•"}
              </span>
            );
          }

          const isCurrent = idx === currentIndex;
          return (
            <span
              key={idx}
              className={`transition-all duration-300 underline-offset-4 ${
                isCurrent ? "font-bold" : "opacity-60"
              }`}
              style={{
                color: isCurrent ? strokeColor : "inherit",
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
    );
  };

  const handleReveal = useCallback(
    (mistakes = null) => {
      const mistakeCount = Number.isFinite(mistakes) ? mistakes : 0;
      console.log("[useCharacterFlow] handleReveal", {
        mistakes,
        currentCharacter,
        index: currentIndex,
      });

      setShowAnswer(true);
      setRevealed(true);
      onReveal?.();

      if (mistakes !== null) {
        setMistakeList((prev) => [...prev, mistakeCount]);
      }

      setCompletedChars((prev) => [...prev, currentCharacter]);
      playAudio?.();

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setRevealed(false);
        setShowAnswer(false);

        if (!isLastCharacter) {
          handleAdvanceCharacter();
          return;
        }

        // Handle final character
        if (allowRating) {
          const avgMistakes = calculateAverage(mistakeCount);
          const rating = getRatingFromMistakes(Math.round(avgMistakes));
          onRate?.(rating);
        } else {
          onPassComplete?.();
        }
      }, 800);
    },
    [
      currentCharacter,
      isLastCharacter,
      allowRating,
      onReveal,
      playAudio,
      handleAdvanceCharacter,
      onRate,
      onPassComplete,
      getRatingFromMistakes,
      calculateAverage,
    ]
  );

  const handleContinue = useCallback(() => {
    if (!isLastCharacter) {
      handleAdvanceCharacter();
    } else {
      onPassComplete?.();
    }
  }, [isLastCharacter, handleAdvanceCharacter, onPassComplete]);

  return {
    currentIndex,
    currentCharacter,
    strokeColor,
    revealed,
    showAnswer,
    handleReveal,
    handleContinue,
    renderWordProgress,
  };
}
