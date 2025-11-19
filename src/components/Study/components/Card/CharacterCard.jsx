import React from "react";
import HanziCanvas from "./HanziCanvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import RevealButton from "../Controls/RevealButton";
import ContinueButton from "../Controls/ContinueButton";

const CharacterCard = ({
  card,
  activeTheme,
  displayState = "reveal", // "animation" | "outline" | "quiz" | "reveal"
  allowRating = false,
  onReveal,
  onRate,
  getRatingFromMistakes,
  onPassComplete,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);
  const [mistakeList, setMistakeList] = React.useState([]);
  const [completedChars, setCompletedChars] = React.useState([]);
  const audioRef = React.useRef(null);

  const characters = React.useMemo(
    () => (card?.front || "").split(""),
    [card?.front]
  );
  const currentCharacter = characters[currentIndex];
  const strokeColor = (() => {
    const toneColors = ["#777777", "#E30000", "#02B31C", "#1510F0", "#8900BF"];
    const toneIdx =
      card?.tones && card.tones[currentIndex] ? card.tones[currentIndex] : 0;
    return toneColors[toneIdx] ?? "#777777";
  })();

  const playAudio = React.useCallback(() => {
    if (audioRef.current && card?.audioUrl) {
      audioRef.current.play().catch(() => {});
    }
  }, [card?.audioUrl]);

  // Reset when card changes
  React.useEffect(() => {
    setCurrentIndex(0);
    setRevealed(false);
    setMistakeList([]);
    setCompletedChars([]);
    playAudio();
  }, [card?.id, playAudio, displayState]);

  /**
   * Called when HanziCanvas completes a quiz for the current character.
   * summaryMistakes is a number or undefined.
   * Behavior:
   * - if this is a quiz pass:
   *   - record mistakes for current character in mistakeList
   *   - move to next character or finish the card pass
   * - When entire card pass finishes:
   *   - if allowRating === true -> compute avgRating and call onRate(avgRating)
   *   - else -> call onPassComplete() to notify controller to just advance
   */
  const handleQuizComplete = (summaryMistakes = 0) => {
    const m = Number.isFinite(summaryMistakes) ? summaryMistakes : 0;
    const newMistakes = [...mistakeList, m];
    setMistakeList(newMistakes);
    setCompletedChars((p) => [...p, currentCharacter]);

    // brief pause to show full character and audio
    playAudio();

    setTimeout(() => {
      if (currentIndex < characters.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        // finished this card in this pass
        if (allowRating) {
          // compute average mistakes -> rating
          const avgMistakes =
            newMistakes.reduce((a, b) => a + b, 0) / newMistakes.length;
          const finalRating = getRatingFromMistakes(Math.round(avgMistakes));
          onRate?.(finalRating);
        } else {
          onPassComplete?.();
        }
      }
    }, 900);
  };

  const handleContinue = () => {
    if (currentIndex < characters.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onPassComplete?.(); // only when final character is done
    }
  };

  const renderWordProgress = () => {
    return (
      <div className="flex space-x-2 text-2xl justify-center items-center">
        {characters.map((ch, idx) => {
          // QUIZ MODE LOGIC
          if (isQuiz) {
            const revealed = idx < completedChars.length;
            return (
              <span
                key={idx}
                className={`transition-all duration-300 ${
                  revealed ? "opacity-100" : "opacity-20"
                }`}
              >
                {revealed ? ch : "•"} {/* placeholder dot */}
              </span>
            );
          }

          // ANIMATION + OUTLINE MODE LOGIC
          const isCurrent = idx === currentIndex;

          return (
            <span
              key={idx}
              className={`
              transition-all duration-300 
              ${
                isCurrent ? "text-yellow-500 font-bold underline" : "opacity-60"
              }
            `}
            >
              {ch}
            </span>
          );
        })}
      </div>
    );
  };

  /**
   * If displayState === 'reveal', user can ask to reveal current character
   * We'll reveal current char briefly, then move to next char or finish the pass.
   * When finished:
   * - if allowRating true => call onRate('again')? (but per design rating should be from final quiz only)
   * - else call onPassComplete()
   *
   * We will NOT call onRate during non-allowRating reveal. Only final quiz triggers rating.
   */
  const handleReveal = () => {
    setRevealed(true);
    onReveal?.();

    setCompletedChars((prev) => [...prev, currentCharacter]);

    setTimeout(() => {
      setRevealed(false);
      if (currentIndex < characters.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        // pass finished for this card
        if (allowRating) {
          // If this phase unexpectedly allows rating on reveal, treat as weak recall ("again")
          onRate?.("again");
        } else {
          onPassComplete?.();
        }
      }
    }, 1000);
  };

  // decide HanziCanvas behavior from displayState:
  const isQuiz = displayState === "quiz";

  const showContinue =
    displayState === "animation" || displayState === "outline";

  console.log("character", currentCharacter, "displayState", displayState);
  return (
    <div
      className={`relative w-full rounded-xl ${
        activeTheme?.background?.secondary ?? "bg-gray-100"
      } p-8 flex flex-col justify-start items-center shadow-2xl transition-all duration-300`}
    >
      {/* Header */}
      <div className="w-full flex justify-between items-center mt-2 px-2 text-center">
        <div className="w-8" />
        <p
          className={`text-xl font-bold leading-tight ${
            activeTheme?.text?.primary ?? "text-black"
          }`}
        >
          {card?.reading}
        </p>
        {card?.audioUrl ? (
          <button
            onClick={playAudio}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <FontAwesomeIcon icon={faVolumeHigh} className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>

      {/* Canvas */}
      <div className="relative flex justify-center items-center w-full mb-2">
        <HanziCanvas
          key={`${card?.id}-${currentIndex}-${displayState}`}
          character={currentCharacter}
          displayState={revealed ? "reveal" : displayState}
          onQuizComplete={handleQuizComplete}
          activeTheme={activeTheme}
          strokeColor={strokeColor}
        />
      </div>

      {/* Bottom controls / reveal */}
      <div className="flex flex-col w-full justify-center items-center px-4 mt-4 text-center space-y-3">
        {/* Characters studied so far */}
        {renderWordProgress()}

        {/* Translation / back text */}
        <p
          className={`text-sm italic ${
            activeTheme?.text?.secondary ?? "text-gray-600"
          }`}
        >
          {card?.back}
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center">
          {!showContinue && !revealed && (
            <RevealButton onReveal={handleReveal} activeTheme={activeTheme} />
          )}

          {showContinue && (
            <ContinueButton
              onContinue={handleContinue}
              activeTheme={activeTheme}
            />
          )}
        </div>
      </div>

      {card?.audioUrl && (
        <audio ref={audioRef} src={card.audioUrl} preload="auto" />
      )}
    </div>
  );
};

export default CharacterCard;
