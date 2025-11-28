export function sm2Update(card, rating) {
  const qMap = {
    again: 0,
    hard: 3,
    good: 4,
    easy: 5,
  };

  const q = qMap[rating];
  if (q === undefined) return card;

  const ef = card.ease_factor ?? 2.5;
  const rep = card.repetitions ?? 0;
  const interval = card.review_interval ?? 0;

  // EF update
  let newEF = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (newEF < 1.3) newEF = 1.3;

  let newReps = rep;
  let newInterval = interval;

  if (q < 3) {
    // Fail
    newReps = 0;
    newInterval = 1;
  } else {
    newReps = rep + 1;
    if (newReps === 1) newInterval = 1;
    else if (newReps === 2) newInterval = 6;
    else newInterval = Math.round(interval * newEF);
  }

  const now = new Date();
  const newDue = new Date(
    now.getTime() + newInterval * 24 * 60 * 60 * 1000
  ).toISOString();

  return {
    ...card,
    ease_factor: newEF,
    repetitions: newReps,
    review_interval: newInterval,
    due_date: newDue,
    last_studied: now.toISOString(),
  };
}
