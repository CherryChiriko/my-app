import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCards } from "../../../slices/cardSlice";
// import { updateCardProgress } from "../../../slices/progressSlice";
import {
  updateGlobalStreak,
  updateDeckStreak,
} from "../../../slices/streakSlice";
import { sm2Update } from "../../../utils/sm2Update";
import { PHASES, LEARN_LIMIT, REVIEW_LIMIT } from "../constants/constants";

export default function useStudySession({ activeDeck, mode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isReviewMode = mode === "review";
  const limit = isReviewMode ? REVIEW_LIMIT : LEARN_LIMIT;

  const userProfile = useSelector((state) => state.auth.profile); // adjust to your auth slice
  const userId = userProfile?.id;

  // --------------------------------------------------------------------------
  // Cards
  // --------------------------------------------------------------------------
  const allCards = useSelector(selectCards);

  const cards = useMemo(() => {
    return allCards.slice(0, limit); // deterministic
  }, [allCards, limit]);

  // --------------------------------------------------------------------------
  // Phases (A or C)
  // --------------------------------------------------------------------------
  const phases = isReviewMode
    ? [{ displayState: "quiz", allowRating: true }]
    : PHASES[activeDeck.studyMode] ?? PHASES.A;

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
  }, [activeDeck?.id, allCards.length]);

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

      //   const updated = sm2Update(currentCard, rating);

      // Supabase update
      //   dispatch(updateCardProgress(updated));

      // Optimistic local store update
      //   dispatch(
      //     updateLocalProgress({
      //       cardId: currentCard.id,
      //       updates: updated,
      //     })
      //   );

      setSessionReviewed((c) => c + 1);

      advanceCard();
    },
    [currentCard, currentPhase, dispatch, advanceCard]
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

  // Run side-effect when sessionFinished becomes true
  useEffect(() => {
    if (!sessionFinished) return;
    if (!userId || !activeDeck?.id) return;

    const studiedCount = sessionReviewed + sessionLearned;

    // dispatch deck streak update (only if at least 1 card from this deck was studied)
    dispatch(
      updateDeckStreak({
        userId,
        deckId: activeDeck.id,
        studiedCount,
      })
    );

    // dispatch global streak update (pass reviewed and learned counts)
    dispatch(
      updateGlobalStreak({
        userId,
        reviewedCount: sessionReviewed,
        learnedCount: sessionLearned,
      })
    );

    // optionally you may also dispatch a "recordStudyActivity" to deck slice etc.
  }, [
    sessionFinished,
    sessionReviewed,
    sessionLearned,
    userId,
    activeDeck?.id,
    dispatch,
  ]);

  // --------------------------------------------------------------------------
  // Progress counters
  // --------------------------------------------------------------------------
  const totalSteps = totalPhases * limit || 1;
  const currentStep = phaseIndex * limit + cardIndex + 1;
  const progressPercentage = (currentStep / totalSteps) * 100;

  return {
    // State
    cards,
    currentCard,
    currentPhase,
    sessionFinished,
    progressPercentage,
    currentStep,
    totalSteps,
    sessionReviewed,
    sessionLearned,

    // API
    handleRate,
    handlePass,
    restartSession,
    exitStudy,

    // constants
    limit,
  };
}
