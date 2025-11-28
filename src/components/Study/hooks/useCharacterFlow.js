import { useState, useMemo, useCallback, useEffect } from "react";

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

  useEffect(() => {
    setCurrentIndex(0);
    setRevealed(false);
    setMistakeList([]);
    setCompletedChars([]);
    playAudio?.();
  }, [card?.id, playAudio]);

  const isLastCharacter = currentIndex === characters.length - 1;

  const calculateAverage = useCallback(
    (mistakesForCurrentChar) => {
      const all = [...mistakeList, mistakesForCurrentChar];
      return all.reduce((a, b) => a + b, 0) / all.length;
    },
    [mistakeList]
  );

  const handleReveal = useCallback(
    (mistakes = 0) => {
      setRevealed(true);
      onReveal?.();

      setMistakeList((prev) => [...prev, mistakes]);
      setCompletedChars((prev) => [...prev, currentCharacter]);
      playAudio?.();
    },
    [currentCharacter, onReveal, playAudio]
  );

  const handleContinue = useCallback(() => {
    if (!revealed) return; // user must reveal first

    if (!isLastCharacter) {
      setCurrentIndex((i) => i + 1);
      setRevealed(false);
      return;
    }

    // LAST CHARACTER
    if (allowRating) {
      const avg = calculateAverage(mistakeList[mistakeList.length - 1] ?? 0);
      const rating = getRatingFromMistakes(Math.round(avg));
      onRate?.(rating);
    } else {
      onPassComplete?.();
    }
  }, [
    revealed,
    isLastCharacter,
    allowRating,
    calculateAverage,
    mistakeList,
    onRate,
    onPassComplete,
    getRatingFromMistakes,
  ]);

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

  return {
    currentIndex,
    currentCharacter,
    strokeColor,
    revealed,
    handleReveal,
    handleContinue,
    renderWordProgress,
  };
}
