/**
 * Determines a card's display status based on its stored progress.
 * @param {Object} progress - The card's progress object (from Redux/DB).
 * @returns {string} The computed status: 'due', 'waiting', 'new', or 'mastered'.
 */
export const getCardStatus = (progress) => {
  const now = new Date();
  if (progress.suspended) return progress.status;
  switch (progress.status) {
    case "mastered":
    case "new":
      return progress.status;
    case "waiting":
      return progress.due_date && new Date(progress.due_date) <= now
        ? "due"
        : progress.status;
    default:
      return "new";
  }
};
