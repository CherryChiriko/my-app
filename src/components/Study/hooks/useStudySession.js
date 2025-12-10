import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCards, updateCardProgress } from "../../../slices/cardSlice";
import {
  updateGlobalStreak,
  updateDeckStreak,
} from "../../../slices/streakSlice";
import { logStudySession } from "../../../slices/activitySlice";
import { updateProgress } from "../../../slices/progressSlice";
import { computeSM2 } from "../../../utils/srs";
import useAuth from "../../../hooks/useAuth";
import { PHASES, LEARN_LIMIT, REVIEW_LIMIT } from "../constants/constants";

export default function useStudySession({ deck, navMode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUpdatesRef = useRef([]);
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

    const filtered = allCards.filter(
      (c) => c.status === (isReviewMode ? "due" : "new")
    );
    console.log(
      `[USE_MEMO] Total allCards: ${allCards.length}. Filtered to: ${filtered.length}.`
    );
    if (filtered.length > 0) {
      console.log(
        `[USE_MEMO] First card ID: ${filtered[0].id}, Status: ${filtered[0].status}`
      );
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

  // const [sessionUpdates, setSessionUpdates] = useState([]);

  const currentPhase = phases[phaseIndex];
  // const currentCard = cards[cardIndex];

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
  // Reset when deck or available cards change
  // --------------------------------------------------------------------------
  const [sessionCards, setSessionCards] = useState([]);

  useEffect(() => {
    if (!deck?.id) return;

    if (allCards.length > 0 && allCards[0].deck_id === deck.id) {
      const filtered = allCards.filter(
        (c) => c.status === (isReviewMode ? "due" : "new")
      );
      setSessionCards(filtered.slice(0, limit));
    }
  }, [deck?.id, allCards, isReviewMode, limit]);

  // Use sessionCards instead of cards
  const currentCard = sessionCards[cardIndex];
  // --------------------------------------------------------------------------
  // Send batch updates at the end of session
  // --------------------------------------------------------------------------

  useEffect(() => {
    console.log("session updates?", sessionUpdatesRef);
    if (!sessionFinished || sessionUpdatesRef.length === 0) return;

    const sendBatch = async () => {
      try {
        await dispatch(
          updateProgress({
            sessionUpdates: sessionUpdatesRef.current,
            study_mode: deck.study_mode,
          })
        ).unwrap();

        // setSessionUpdates([]);
        sessionUpdatesRef.current = [];
      } catch (err) {
        console.error("Failed to update card progress in batch:", err);
      }
    };

    sendBatch();
  }, [deck.study_mode, dispatch, sessionFinished, sessionUpdatesRef]);

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
    console.log(
      `[ADVANCE_CARD] Before: Card Index ${cardIndex}, Phase Index ${phaseIndex}. Limit: ${limit}, Total Phases: ${totalPhases}`
    );
    if (cardIndex + 1 < limit) {
      setCardIndex((i) => i + 1);
      console.log(`[ADVANCE_CARD] Action: Next Card in Phase.`);
      return;
    }

    if (phaseIndex + 1 < totalPhases) {
      setPhaseIndex((p) => p + 1);
      setCardIndex(0);
      console.log(phaseIndex);
      console.log(`[ADVANCE_CARD] Action: Next Phase, reset Card Index.`);
      return;
    }
    console.log("Session finished");
    setSessionFinished(true);
  }, [cardIndex, limit, phaseIndex, totalPhases]);

  // --------------------------------------------------------------------------
  // Rating (SM-2 + Supabase)
  // --------------------------------------------------------------------------
  // const handleRate = useCallback(
  //   async (rating) => {
  //     if (!userId || !currentCard || !currentPhase.allowRating) return;
  //     console.log("useStudySession", rating);

  //     // Compute SM2 locally
  //     const updates = computeSM2(currentCard, rating);

  //     // Add to sessionUpdates
  //     setSessionUpdates((prev) => [...prev, { card: currentCard, updates }]);

  //     setSessionReviewed((c) => c + 1);
  //     advanceCard();
  //   },
  //   [currentCard, currentPhase, advanceCard, userId]
  // );

  const handleRate = useCallback(
    async (rating) => {
      if (!userId || !currentCard || !currentPhase.allowRating) return;

      // 1. Compute SM2 locally
      const updates = computeSM2(currentCard, rating);

      // 2. Dispatch the new progress to Redux store immediately
      // This flips the card status to 'waiting' in Redux, removing it from the filtered `cards` list.
      console.log("Handle Rate");
      dispatch(
        updateCardProgress({
          cardId: currentCard.id,
          updates: updates,
        })
      );
      console.log(
        `[HANDLE_RATE] Rated Card ID: ${currentCard.id}. New due_date: ${updates.due_date}. New repetitions: ${updates.repetitions}`
      );

      const updatedCard = {
        user_id: userId,
        deck_id: currentCard.deck_id,
        card_id: currentCard.card_id,
        status: "waiting",
        suspended: false,
        ...updates,
      };

      sessionUpdatesRef.current = [...sessionUpdatesRef.current, updatedCard];
      // 3. Add the card to the batch to post later
      // setSessionUpdates((prev) => [...prev, updatedCard]);

      // 4. Advance
      setSessionReviewed((c) => c + 1);
      advanceCard();
    },
    [currentCard, currentPhase, advanceCard, userId, dispatch]
  );

  // --------------------------------------------------------------------------
  // Rating (SM-2 + Supabase)
  // --------------------------------------------------------------------------
  // const handleRate = useCallback(
  //   async (rating) => {
  //     if (!userId || !currentCard || !currentPhase.allowRating) return;
  //     console.log("useStudySession", rating);

  //     // 1. Update Redux store
  //     setSessionReviewed((c) => c + 1);
  //     advanceCard();

  //     console.log(currentCard, rating, userId, deck.study_mode);
  //     // 2. Update Supabase / server

  //     try {
  //       const result = await dispatch(
  //         updateProgress({
  //           card: currentCard,
  //           rating,
  //           study_mode: deck.study_mode,
  //           user_id: userId,
  //         })
  //       ).unwrap();

  //       console.log("updateProgress success:", result);
  //     } catch (err) {
  //       console.error("Failed to update card progress:", err);
  //     }
  //   },
  //   [currentCard, currentPhase, advanceCard, deck.study_mode, dispatch, userId]
  // );

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
    // setSessionUpdates([]);
    sessionUpdatesRef.current = [];
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
    deck.id,
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
