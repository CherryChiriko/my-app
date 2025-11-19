import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../General/Header";
import CardRenderer from "../Flashcards/CardRenderer";
import { selectAllCards, updateCard } from "../../../slices/cardSlice";
import { recordStudyActivity } from "../../../slices/deckSlice";
import { getUpdatedCard } from "../../../helpers/getUpdatedCard";
import SessionComplete from "./SessionComplete";

const LEARN_LIMIT = 1;
const REVIEW_LIMIT = 10;

const PHASES = {
  A: [
    { displayState: "reveal", allowRating: false },
    { displayState: "quiz", allowRating: true },
  ],
  C: [
    { displayState: "animation", allowRating: false },
    { displayState: "outline", allowRating: false },
    { displayState: "quiz", allowRating: true },
  ],
};

const SessionMode = ({ mode, activeTheme, activeDeck }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sessionFinished, setSessionFinished] = useState(false);

  const limit = mode === "review" ? REVIEW_LIMIT : LEARN_LIMIT;

  const allCards = useSelector(selectAllCards);
  const cards = useMemo(() => allCards.slice(0, limit), [limit, allCards]);

  const phases = PHASES[activeDeck.studyMode] ?? PHASES.A;
  const totalPhases = phases.length;

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [sessionReviewed, setSessionReviewed] = useState(0);
  const [sessionLearned, setSessionLearned] = useState(0);

  const currentPhase = phases[phaseIndex];
  const currentCard = cards[cardIndex];

  useEffect(() => {
    // Reset indexes when cards change (new deck)
    setPhaseIndex(0);
    setCardIndex(0);
    setSessionReviewed(0);
    setSessionLearned(0);
  }, [activeDeck?.id, allCards.length]);

  const exitStudy = () => {
    // Record study activity and navigate away
    dispatch(
      recordStudyActivity({
        deckId: activeDeck.id,
        learnCount: sessionLearned,
        reviewCount: sessionReviewed,
      })
    );
    navigate("/decks");
  };

  const advanceCard = () => {
    // Move to next card in same phase, or next phase if at end
    if (cardIndex + 1 < limit) {
      setCardIndex((i) => i + 1);
    } else if (phaseIndex + 1 < totalPhases) {
      // next phase: reset card index
      setPhaseIndex((p) => p + 1);
      setCardIndex(0);
    } else {
      // finished session
      // exitStudy();
      setSessionFinished(true);
    }
  };

  /**
   * Called when the child component signals a rating for this card.
   * Only called in phases where allowRating=true.
   */
  const handleRate = async (rating) => {
    if (!currentCard) return;

    try {
      const newCardState = getUpdatedCard(currentCard, rating);

      // Backend update attempt
      let updatedCard = newCardState;
      try {
        const res = await fetch(
          `http://localhost:5000/cards/${currentCard.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCardState),
          }
        );
        if (res.ok) {
          updatedCard = await res.json();
          console.log("✅ Card updated on backend:", updatedCard);
        } else {
          console.warn("⚠️ Backend update failed, using local SRS.");
        }
      } catch (err) {
        console.warn("💡 Offline mode: using local SRS fallback.", err);
      }

      dispatch(updateCard(updatedCard));
      setSessionReviewed((c) => c + 1);
    } catch (err) {
      console.error("Failed to rate card", err);
    } finally {
      // Move on after rating
      advanceCard();
    }
  };

  /**
   * Called by a child when a pass over the current card is complete but
   * ratings are NOT allowed for that phase. We simply advance.
   */
  const handlePassComplete = () => {
    // If this pass is the one that implies "learned", we can increment learned.
    // We decide that only when final phase had allowRating we will mark learned via rating.
    // However if you want to mark 'learned' after certain phase, do it here.
    // For now we only advance.
    advanceCard();
  };

  const handleLearnMore = () => {
    setSessionFinished(false);
    setPhaseIndex(0);
    setCardIndex(0);
    setSessionLearned(0);
  };

  // Progress calculation: progress through total steps = totalPhases * limit
  const totalSteps = totalPhases * limit || 1;
  const currentStep = phaseIndex * limit + cardIndex + 1;
  const progressPercentage = ((currentStep / totalSteps) * 100).toFixed(1);

  if (!cards.length) {
    return (
      <div
        className={`h-screen flex flex-col items-center justify-center ${activeTheme.background.app} text-center`}
      >
        <h3
          className={`text-2xl font-semibold mb-3 ${activeTheme.text.primary}`}
        >
          🎉 No cards available for this session
        </h3>
        <button
          onClick={exitStudy}
          className={`flex items-center ${activeTheme.text.muted} hover:${activeTheme.text.primary} transition-colors duration-200`}
        >
          Return to decks
        </button>
      </div>
    );
  }

  if (sessionFinished) {
    return (
      <div
        className={`h-screen flex flex-col items-center justify-center ${activeTheme.background.app} text-center`}
      >
        <SessionComplete
          learnedCount={limit}
          isOpen={true}
          onGoBack={exitStudy}
          onLearnMore={handleLearnMore}
          activeTheme={activeTheme}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${activeTheme.background.app} ${activeTheme.text.primary} w-full`}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
        <Header title={`${activeDeck.name}`} />

        {/* Top bar */}
        <header className="flex justify-between items-center mb-10">
          <button
            onClick={exitStudy}
            className={`flex items-center ${activeTheme.text.muted} hover:${activeTheme.text.primary} transition-colors duration-200`}
          >
            Exit Study
          </button>

          <div className="flex flex-col items-center flex-grow mx-4">
            <p className={`${activeTheme.text.muted} text-sm mb-2`}>
              {currentStep} of {totalSteps}
            </p>
            <div className="w-full max-w-xl bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full bg-gradient-to-r ${activeTheme.gradients.from} ${activeTheme.gradients.to}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="w-32" />
        </header>

        {/* Card area */}
        <div
          className={`relative perspective-1000 w-full max-w-2xl mx-auto h-96 mb-8`}
        >
          <CardRenderer
            card={currentCard}
            studyMode={activeDeck.studyMode}
            phase={currentPhase}
            activeTheme={activeTheme}
            showAnswer={true}
            displayState={currentPhase.displayState}
            allowRating={currentPhase.allowRating}
            onRate={handleRate}
            onPassComplete={handlePassComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default SessionMode;
