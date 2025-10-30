import React from "react";
import HanziCanvas from "../HanziCanvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import {
  faFaceTired,
  faFaceFrown,
  faFaceSmile,
  faFaceLaughBeam,
} from "@fortawesome/free-solid-svg-icons";
import RevealButton from "./RevealButton";

const ratingIcons = {
  again: { icon: faFaceTired, color: "text-red-500" },
  hard: { icon: faFaceFrown, color: "text-orange-500" },
  good: { icon: faFaceSmile, color: "text-blue-500" },
  easy: { icon: faFaceLaughBeam, color: "text-green-500" },
};

const CharacterCard = ({
  card,
  activeTheme,
  onReveal,
  onRate,
  getRatingFromMistakes,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);
  const [quizComplete, setQuizComplete] = React.useState(false);
  const [mistakeList, setMistakeList] = React.useState([]);
  const [currentRating, setCurrentRating] = React.useState(null);
  const [completedChars, setCompletedChars] = React.useState([]);
  const audioRef = React.useRef(null);

  const cardBg = activeTheme?.background?.secondary ?? "bg-gray-100";
  const primaryText = activeTheme?.text?.primary ?? "text-black";
  const secondaryText = activeTheme?.text?.secondary ?? "text-black";

  const characters = React.useMemo(() => card.front.split(""), [card.front]);
  const currentCharacter = characters[currentIndex];

  const toneColors = ["#777777", "#E30000", "#02B31C", "#1510F0", "#8900BF"];
  const strokeColor = toneColors[card.tones[currentIndex]];

  const playAudio = React.useCallback(() => {
    if (audioRef.current && card.audioUrl) {
      audioRef.current.play().catch(() => {});
    }
  }, [card.audioUrl]);

  // --- Reset on new card ---
  React.useEffect(() => {
    setCurrentIndex(0);
    setRevealed(false);
    setQuizComplete(false);
    setMistakeList([]);
    setCurrentRating(null);
    setCompletedChars([]);
    playAudio(); // play once at start
  }, [card.id, playAudio]);

  // --- When character quiz is complete ---
  const handleQuizComplete = (mistakesCount) => {
    const rating = getRatingFromMistakes(mistakesCount);
    setCurrentRating(rating);
    setRevealed(true);
    const newMistakes = [...mistakeList, mistakesCount];
    setMistakeList(newMistakes);

    // add completed char to bottom-left display
    setCompletedChars((prev) => [...prev, currentCharacter]);

    // show full character + emoji, then go next
    setTimeout(() => {
      setCurrentRating(null);

      if (currentIndex < characters.length - 1) {
        setCurrentIndex((i) => i + 1);
        setRevealed(false);
      } else {
        // finished all characters
        setQuizComplete(true);
        const avgMistakes =
          newMistakes.reduce((a, b) => a + b, 0) / newMistakes.length;
        const avgRating = getRatingFromMistakes(avgMistakes);

        playAudio(); // replay word audio at end
        setTimeout(() => onRate(avgRating), 1000);
      }
    }, 2000);
  };

  // --- FIXED: Reveal single current character ---
  const handleReveal = () => {
    setRevealed(true);
    onReveal?.();

    // show current character, mark as again
    setCompletedChars((prev) => [...prev, currentCharacter]);

    setTimeout(() => {
      setRevealed(false);
      if (currentIndex < characters.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        setQuizComplete(true);
        onRate("again");
      }
    }, 1000);
  };

  const ratingDisplay = currentRating ? ratingIcons[currentRating] : null;

  return (
    <div
      className={`relative w-full rounded-xl ${cardBg} p-8 flex flex-col justify-start items-center shadow-2xl transition-all duration-300`}
    >
      {/* Header */}
      <div className="w-full flex justify-between items-center mt-2 px-2 text-center">
        <div className="w-8" />
        <p className={`text-xl font-bold leading-tight ${primaryText}`}>
          {card.reading}
        </p>
        {card.audioUrl ? (
          <button
            onClick={playAudio}
            className={`p-2 rounded-full ${
              activeTheme?.button?.secondary ?? "bg-gray-200"
            } ${primaryText} hover:bg-gray-300 transition-colors`}
          >
            <FontAwesomeIcon icon={faVolumeHigh} className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>

      {/* Canvas area */}
      <div className="relative flex justify-center items-center w-full mb-2">
        <HanziCanvas
          key={`${card.id}-${currentIndex}-${revealed}`}
          character={currentCharacter}
          quizActive={!revealed && !quizComplete}
          showFullCharacter={revealed}
          onQuizComplete={handleQuizComplete}
          activeTheme={activeTheme}
          strokeColor={strokeColor}
        />
      </div>

      <div className="flex flex-row">
        {/* Meaning + reveal button */}
        <div className="flex flex-col items-center mt-2 px-2 text-center">
          {/* Bottom-left completed characters */}
          {completedChars.length > 0 && (
            <div className="flex space-x-2 text-2xl opacity-80">
              {completedChars.map((char, idx) => (
                <span key={idx} className={`${primaryText}`}>
                  {char}
                </span>
              ))}
            </div>
          )}
          <p className={`text-sm italic ${secondaryText}`}>{card.back}</p>
          <div className="w-full flex justify-center items-center mt-auto">
            {!revealed && !quizComplete ? (
              <RevealButton onReveal={handleReveal} activeTheme={activeTheme} />
            ) : (
              <div className="w-[150px]" />
            )}
          </div>
        </div>
        {/* Rating emoji */}
        {ratingDisplay && (
          <div className="text-4xl">
            <FontAwesomeIcon
              icon={ratingDisplay.icon}
              className={ratingDisplay.color}
            />
          </div>
        )}
      </div>

      {card.audioUrl && (
        <audio ref={audioRef} src={card.audioUrl} preload="auto" />
      )}
    </div>
  );
};

export default CharacterCard;
