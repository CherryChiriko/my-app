import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCards } from "../../../slices/cardSlice";
import {
  updateGlobalStreak,
  updateDeckStreak,
} from "../../../slices/streakSlice";
import useAuth from "../../../hooks/useAuth";
import { PHASES, LEARN_LIMIT, REVIEW_LIMIT } from "../constants/constants";

export default function useStudySession({ deck, navMode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { session } = useAuth();

  const isReviewMode = navMode === "review";
  const limit = isReviewMode ? REVIEW_LIMIT : LEARN_LIMIT;

  const userId = session?.user?.id;

  // --------------------------------------------------------------------------
  // Cards
  // --------------------------------------------------------------------------
  const allCards = useSelector(selectCards);

  const cards = useMemo(() => {
    return allCards.slice(0, limit);
  }, [allCards, limit]);

  // --------------------------------------------------------------------------
  // Phases (A or C)
  // --------------------------------------------------------------------------
  const phases = isReviewMode
    ? [{ displayState: "quiz", allowRating: true }]
    : PHASES[deck?.study_mode] ?? PHASES.A;

  const totalPhases = phases.length;

  // --------------------------------------------------------------------------
  // Session State
  // --------------------------------------------------------------------------
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);

  const [sessionReviewed, setSessionReviewed] = useState(0);
  const [sessionLearned, setSessionLearned] = useState(0);

  const currentPhase = phases[phaseIndex];
  const currentCard = cards[cardIndex];

  // --------------------------------------------------------------------------
  // Reset when deck or available cards change
  // --------------------------------------------------------------------------
  useEffect(() => {
    setPhaseIndex(0);
    setCardIndex(0);
    setSessionFinished(false);
    setSessionReviewed(0);
    setSessionLearned(0);
  }, [deck?.id, allCards.length]);

  // --------------------------------------------------------------------------
  // Navigation
  // --------------------------------------------------------------------------
  const exitStudy = useCallback(() => {
    navigate("/decks");
  }, [navigate]);

  // --------------------------------------------------------------------------
  // Advance step
  // --------------------------------------------------------------------------
  const advanceCard = useCallback(() => {
    if (cardIndex + 1 < limit) {
      setCardIndex((i) => i + 1);
      return;
    }

    if (phaseIndex + 1 < totalPhases) {
      setPhaseIndex((p) => p + 1);
      setCardIndex(0);
      return;
    }

    setSessionFinished(true);
  }, [cardIndex, limit, phaseIndex, totalPhases]);

  // --------------------------------------------------------------------------
  // Rating (SM-2 + Supabase)
  // --------------------------------------------------------------------------
  const handleRate = useCallback(
    async (rating) => {
      if (!currentCard || !currentPhase.allowRating) return;

      // TODO: Implement SM-2 update
      // const updated = sm2Update(currentCard, rating);
      // dispatch(updateCardProgress(updated));

      setSessionReviewed((c) => c + 1);
      advanceCard();
    },
    [currentCard, currentPhase, advanceCard]
  );

  // --------------------------------------------------------------------------
  // Pass (no rating)
  // --------------------------------------------------------------------------
  const handlePass = useCallback(() => {
    advanceCard();
  }, [advanceCard]);

  // --------------------------------------------------------------------------
  // Restart session (same deck)
  // --------------------------------------------------------------------------
  const restartSession = useCallback(() => {
    setSessionFinished(false);
    setPhaseIndex(0);
    setCardIndex(0);
    setSessionLearned(0);
    setSessionReviewed(0);
  }, []);

  // --------------------------------------------------------------------------
  // Update streaks when session finishes
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!sessionFinished) return;
    if (!userId || !deck?.id) return;

    const studiedCount = sessionReviewed + sessionLearned;

    // Update deck streak
    dispatch(
      updateDeckStreak({
        userId,
        deckId: deck.id,
        studiedCount,
      })
    );

    // Update global streak
    dispatch(
      updateGlobalStreak({
        userId,
        reviewedCount: sessionReviewed,
        learnedCount: sessionLearned,
      })
    );
  }, [
    sessionFinished,
    sessionReviewed,
    sessionLearned,
    userId,
    deck?.id,
    dispatch,
  ]);

  // --------------------------------------------------------------------------
  // Progress counters
  // --------------------------------------------------------------------------
  const totalSteps = totalPhases * limit || 1;
  const currentStep = phaseIndex * limit + cardIndex + 1;
  const progressPercentage = (currentStep / totalSteps) * 100;

  // --------------------------------------------------------------------------
  // Return values matching what components expect
  // --------------------------------------------------------------------------
  return {
    // State
    cards,
    currentCard,
    currentPhase,
    sessionFinished,
    progressPercentage,
    progress: { current: currentStep, total: totalSteps }, // For Bar component
    currentStep,
    totalSteps,
    sessionReviewed,
    sessionLearned,

    // API
    handleRate,
    handlePass,
    handlePassComplete: handlePass, // alias for SessionMode
    restartSession,
    resetSession: restartSession, // alias for SessionMode
    exitStudy,
    exitSession: exitStudy, // alias for SessionMode

    // Constants
    limit,
    mode: navMode, // return mode for components that need it
    status: "succeeded", // TODO: implement proper loading states
  };
}
