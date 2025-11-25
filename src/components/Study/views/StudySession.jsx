import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchCards, selectCardsStatus } from "../../../slices/cardSlice";
import { selectActiveTheme } from "../../../slices/themeSlice";
import { selectActiveDeck } from "../../../slices/deckSlice";
import SessionMode from "./SessionMode";

const StudySession = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Gets 'learn' or 'review' from URL
  const navMode = searchParams.get("mode");

  const activeTheme = useSelector(selectActiveTheme);
  const activeDeck = useSelector(selectActiveDeck);
  const status = useSelector(selectCardsStatus); // 'idle', 'loading', 'succeeded', 'failed'

  // --- START: MODE SELECTION LOGIC ---
  let currentMode = null;

  if (activeDeck) {
    // Ensure you use the correct prop name from your deck slice
    const newCards =
      activeDeck.cardsCount - activeDeck.mastered - activeDeck.due;
    const dueCards = activeDeck.due;

    // 1. Explicit mode selection from URL
    if (navMode === "review" || navMode === "learn") {
      currentMode = navMode;
    } else if (newCards > 0) {
      currentMode = "learn";
    } else if (dueCards > 0) {
      currentMode = "review";
    }
  }
  // --- END: MODE SELECTION LOGIC ---

  // --- Core Logic: Fetch Cards when Deck is Ready ---
  useEffect(() => {
    if (!activeDeck?.id) return;

    dispatch(
      fetchCards({
        deck_id: activeDeck.id,
        studyMode: activeDeck.studyMode,
      })
    );
  }, [activeDeck?.id, navMode, dispatch]);

  // --- Render based on loading status and deck availability ---

  if (!activeDeck) {
    return (
      <div
        className={`h-screen flex flex-col items-center justify-center ${activeTheme.background.app}`}
      >
        <p className={`${activeTheme.text.primary} text-xl`}>
          No active deck selected.
        </p>
        <button
          onClick={() => navigate("/decks")}
          className={`flex items-center ${activeTheme.text.muted} hover:${activeTheme.text.primary} transition-colors duration-200`}
        >
          Return to Decks
        </button>
      </div>
    );
  }

  if (status === "loading" || status === "idle") {
    return (
      <div
        className={`h-screen flex items-center justify-center ${activeTheme.background.app}`}
      >
        <p className={`${activeTheme.text.primary} text-xl animate-pulse`}>
          Loading cards for "{activeDeck.name}"...
        </p>
        {/*  */}
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div
        className={`h-screen flex items-center justify-center ${activeTheme.background.app}`}
      >
        <p className={`${activeTheme.text.primary} text-xl`}>
          Error: Failed to load cards. Please check the network connection.
        </p>
      </div>
    );
  }

  // --- Render the specific Study Mode ---
  if (currentMode) {
    return (
      <SessionMode
        mode={currentMode}
        activeTheme={activeTheme}
        activeDeck={activeDeck}
      />
    );
  }

  // Fallback if no cards are available for learning or review
  return (
    <div
      className={`h-screen flex flex-col items-center justify-center ${activeTheme.background.app}`}
    >
      <p className={`${activeTheme.text.primary} text-2xl font-bold`}>
        🎉 All caught up!
      </p>
      <p className={`${activeTheme.text.secondary} text-xl mt-2`}>
        "{activeDeck.name}" has no new or due cards.
      </p>
      <button
        onClick={() => navigate("/decks")}
        className={`flex items-center ${activeTheme.text.muted} hover:${activeTheme.text.primary} transition-colors duration-200`}
      >
        Return to Decks
      </button>
    </div>
  );
};

export default StudySession;
