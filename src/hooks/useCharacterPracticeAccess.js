import { useSelector } from "react-redux";

import { selectIsProUser } from "../slices/userSlice";
import { selectHasPracticedCharacterToday } from "../slices/activitySlice";

export function useCharacterPracticeAccess() {
  const isPro = useSelector(selectIsProUser) ?? false;

  const hasPracticedToday =
    useSelector(selectHasPracticedCharacterToday) ?? false;

  // This limit applies ONLY to Character Mode + Learn.
  // Character Mode + Review remains available to free users.
  const canStartPractice = isPro || !hasPracticedToday;
  console.log(
    "canStartPractice:",
    canStartPractice,
    "isPro:",
    isPro,
    "hasPracticedToday:",
    hasPracticedToday,
  );

  return {
    isPro,
    hasPracticedToday,
    canStartPractice,

    // Free Character Learn = 5 cards/words per session.
    // Pro = no additional Character-specific cap here;
    // useStudySession's normal Learn/Review slider determines the batch size.
    maxCardsPerSession: isPro ? Infinity : 5,

    maxAllowedSessions: isPro ? Infinity : 1,
    characterSessionsToday: hasPracticedToday ? 1 : 0,
    remainingSessions: isPro ? Infinity : hasPracticedToday ? 0 : 1,
  };
}
