// Study/hooks/useStudyFlow.js
import { useState, useEffect, useCallback } from "react";

export function useStudyFlow({ cards, limit = 5, onSessionComplete }) {
  const totalPhases = 3; // animation → outline → quiz

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);

  const [sessionReviewed, setSessionReviewed] = useState(0);
  const [sessionLearned, setSessionLearned] = useState(0);

  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const currentCard = cards?.[cardIndex] || null;

  const displayState = ["animation", "outline", "quiz"][phaseIndex];

  // ---- Reset when new deck is loaded ----
  useEffect(() => {
    setPhaseIndex(0);
    setCardIndex(0);
    setSessionLearned(0);
    setSessionReviewed(0);
  }, [cards?.length]);

  // ---- Advance card or phase ----
  const advanceCard = useCallback(() => {
    if (cardIndex + 1 < limit) {
      setCardIndex((i) => i + 1);
    } else if (phaseIndex + 1 < totalPhases) {
      setPhaseIndex((p) => p + 1);
      setCardIndex(0);
    } else {
      // end of final phase
      setShowCompletionModal(true);
      onSessionComplete?.(); // optional callback
    }
  }, [cardIndex, limit, phaseIndex, onSessionComplete]);

  // ---- Start a new session ("Learn More") ----
  const resetSession = useCallback(() => {
    setShowCompletionModal(false);
    setPhaseIndex(0);
    setCardIndex(0);
    setSessionLearned(0);
    setSessionReviewed(0);
  }, []);

  return {
    // state
    currentCard,
    cardIndex,
    phaseIndex,
    displayState,
    showCompletionModal,

    // actions
    advanceCard,
    resetSession,
    setShowCompletionModal,

    // counts
    sessionReviewed,
    setSessionReviewed,
    sessionLearned,
    setSessionLearned,
  };
}
