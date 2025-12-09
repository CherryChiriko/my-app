import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCards } from "../../../slices/cardSlice";
import {
  updateGlobalStreak,
  updateDeckStreak,
} from "../../../slices/streakSlice";
import { logStudySession } from "../../../slices/activitySlice";
import { updateProgress } from "../../../slices/progressSlice";
import useAuth from "../../../hooks/useAuth";
import { PHASES, LEARN_LIMIT, REVIEW_LIMIT } from "../constants/constants";

export default function useStudySession({ deck, navMode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { session } = useAuth();

  const isReviewMode = navMode === "review";
  const limit = isReviewMode ? REVIEW_LIMIT : LEARN_LIMIT;

  const userId = session?.user?.id;
  const [status, setStatus] = useState("idle");

  // --------------------------------------------------------------------------
  // Cards
  // --------------------------------------------------------------------------
  const allCards = useSelector(selectCards);

  const cards = useMemo(() => {
    if (!deck?.id) return [];

    if (allCards.length > 0 && allCards[0].deck_id !== deck.id) {
      console.warn("Stale deck data");
      return [];
    }

    const now = new Date();

    let filtered = [];

    if (isReviewMode) {
      // REVIEW MODE → only DUE cards
      filtered = allCards.filter((c) => {
        return c.status === "due" && c.due_date && new Date(c.due_date) <= now;
      });
    } else {
      // LEARN MODE → only NEW or LEARNING cards
      filtered = allCards.filter((c) => {
        return c.status === "new";
      });
    }

    return filtered.slice(0, limit);
  }, [allCards, deck?.id, isReviewMode, limit]);

  // --------------------------------------------------------------------------
  // Detect loading / stale / success states (NEW)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!deck?.id) {
      setStatus("idle");
      return;
    }

    // A. No cards at all → loading
    if (allCards.length === 0) {
      setStatus("loading");
      return;
    }

    // B. Stale cards for different deck → loading
    if (allCards[0].deck_id !== deck.id) {
      setStatus("loading");
      return;
    }

    // C. Valid cards loaded
    setStatus("succeeded");
  }, [deck?.id, allCards]);

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
  }, [deck?.id]);

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
    console.log("advancing card");
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
      if (!userId || !currentCard || !currentPhase.allowRating) return;
      console.log("useStudySession", rating);
      // 1. Update Redux store
      setSessionReviewed((c) => c + 1);
      advanceCard();

      console.log(currentCard, rating, userId, deck.study_mode);
      // 2. Update Supabase / server
      try {
        await dispatch(
          updateProgress({
            card: currentCard,
            rating,
            study_mode: deck.study_mode,
            user_id: userId,
          })
        ).unwrap();
      } catch (err) {
        console.error("Failed to update card progress:", err);
      }
    },
    [currentCard, currentPhase, advanceCard, deck.study_mode, dispatch, userId]
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

    dispatch(
      logStudySession({
        cardsStudied: sessionReviewed + sessionLearned,
        cardsReviewed: sessionReviewed,
        cardsLearned: sessionLearned,
        timeStudiedSeconds: session.totalSeconds,
        xpEarned: session.xp,
      })
    );

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
    progress: { current: currentStep - 1, total: totalSteps }, // For Bar component
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
    status: status,
  };
}
