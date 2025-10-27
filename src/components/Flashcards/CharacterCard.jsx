import React from "react";
import HanziCanvas from "../HanziCanvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import RevealButton from "./RevealButton";

const CharacterCard = ({
  card,
  activeTheme,
  onReveal,
  onRate,
  getRatingFromMistakes,
}) => {
  const [quizComplete, setQuizComplete] = React.useState(false);
  const [revealed, setRevealed] = React.useState(false);
  const audioRef = React.useRef(null);

  const cardBg = activeTheme?.background?.secondary ?? "bg-gray-100";
  const primaryText = activeTheme?.text?.primary ?? "text-black";

  const playAudio = () => {
    if (audioRef.current && card.audioUrl) audioRef.current.play();
  };

  React.useEffect(() => {
    // reset state when moving to next card
    setQuizComplete(false);
    setRevealed(false);
    if (card.audioUrl) playAudio();
  }, [card.id]);

  const handleQuizComplete = (mistakesCount) => {
    setQuizComplete(true);
    const rating = getRatingFromMistakes(mistakesCount);
    setTimeout(() => onRate(rating), 1500);
  };

  const handleReveal = () => {
    setRevealed(true);
    onReveal?.();
    // After brief delay, auto-rate as "again"
    setTimeout(() => {
      onRate("again");
    }, 1000);
  };

  return (
    <div
      className={`relative w-full rounded-xl ${cardBg} p-8 flex flex-col justify-start items-center shadow-2xl transition-all duration-300`}
    >
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <div className="w-8" />
        <p className={`text-2xl font-semibold ${primaryText} text-center`}>
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
          <div className="w-8" /> // spacer for layout balance
        )}
      </div>

      {/* Canvas */}
      <div className="flex justify-center items-center w-full mb-8">
        <HanziCanvas
          character={card.front}
          quizActive={!revealed && !quizComplete}
          onQuizComplete={handleQuizComplete}
          activeTheme={activeTheme}
        />
      </div>

      {/* Bottom Row: meaning + reveal button */}
      <div className="w-full flex justify-between items-center mt-auto">
        <div className="w-16" />
        {!revealed && !quizComplete ? (
          <RevealButton onReveal={handleReveal} activeTheme={activeTheme} />
        ) : (
          <div className="w-[150px]" /> // keeps layout aligned
        )}

        <p
          className={`text-xl font-semibold ${primaryText} text-right pr-2 whitespace-nowrap`}
        >
          {card.back}
        </p>
      </div>
    </div>
  );
};

export default CharacterCard;
