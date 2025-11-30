import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setActiveDeck } from "../../../slices/deckSlice";

export default function useDeckCardLogic(deck) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id, mastered = 0, due = 0, cards_count = 0, streak = 0 } = deck || {};

  const newCards = cards_count - mastered - due;
  const showLearn = newCards > 0;
  const showReview = Number(due) > 0;
  const isMastered = cards_count === mastered;
  console.log(newCards, mastered, due, cards_count);

  const handleCardClick = useCallback(() => {
    if (!isMastered) navigate(`/deck/${id}`);
  }, [isMastered, id, navigate]);

  const handleAction = useCallback(
    (e, type) => {
      if (e && e.stopPropagation) e.stopPropagation();
      dispatch(setActiveDeck(id));
      if (type === "learn") navigate("/study?mode=learn");
      if (type === "review") navigate("/study?mode=review");
    },
    [dispatch, id, navigate]
  );

  return useMemo(
    () => ({
      newCards,
      showLearn,
      showReview,
      isMastered,
      streak,
      handleCardClick,
      handleAction,
    }),
    [
      newCards,
      showLearn,
      showReview,
      isMastered,
      streak,
      handleCardClick,
      handleAction,
    ]
  );
}
