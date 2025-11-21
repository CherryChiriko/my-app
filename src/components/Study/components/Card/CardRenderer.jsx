import CharacterCard from "./CharacterCard";
import FlipCard from "./FlipCard";
import NotFound404 from "../../../404";

/* Maps mistake count to an SRS rating  */
const getRatingFromMistakes = (mistakes) => {
  if (mistakes >= 3) return "again";
  if (mistakes === 2) return "hard";
  if (mistakes === 1) return "good";
  return "easy";
};

const CardRenderer = ({
  card,
  studyMode = "A",
  displayState,
  showAnswer,
  allowRating = false,
  activeTheme,
  onReveal,
  onRate,
  onPassComplete,
}) => {
  switch (studyMode) {
    case "A":
      return (
        <FlipCard
          card={card}
          activeTheme={activeTheme}
          showAnswer={showAnswer}
          onReveal={onReveal}
          onRate={onRate}
          allowRating={allowRating}
          onPassComplete={onPassComplete}
        />
      );
    case "C":
      return (
        <CharacterCard
          card={card}
          activeTheme={activeTheme}
          showAnswer={showAnswer}
          displayState={displayState}
          allowRating={allowRating}
          onReveal={onReveal}
          onRate={onRate}
          getRatingFromMistakes={getRatingFromMistakes}
          onPassComplete={onPassComplete}
        />
      );
    default:
      return <NotFound404 />;
  }
};

export default CardRenderer;
