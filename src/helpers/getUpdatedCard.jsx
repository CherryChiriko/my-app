export const getUpdatedCard = (card, rating) => {
  let newInterval = 0;
  let newEase = card.ease;
  let newLapses = card.lapses;

  switch (rating) {
    case "again":
      newInterval = 1;
      newEase = Math.max(1.3, newEase - 0.2);
      newLapses = newLapses + 1;
      break;
    case "hard":
      newInterval = card.interval > 0 ? card.interval * 1.2 : 2;
      break;
    case "good":
      newInterval = card.interval > 0 ? card.interval * newEase : 4;
      break;
    case "easy":
      newInterval = card.interval > 0 ? card.interval * newEase * 1.3 : 6;
      newEase = Math.min(2.5, newEase + 0.15);
      break;
    default:
      newInterval = card.interval;
  }

  const now = new Date();
  const newDueDate = new Date(
    now.getTime() + newInterval * 24 * 60 * 60 * 1000
  );

  return {
    ...card,
    interval: newInterval,
    ease: newEase,
    lapses: newLapses,
    due: newDueDate.toISOString(),
  };
};
