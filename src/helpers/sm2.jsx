/**
 * Update card scheduling using the SM-2 algorithm.
 * Reference: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 *
 * @param {Object} card - The flashcard object with SRS metadata.
 * @param {number} quality - Review quality 0-5 (Again=0, Hard=3, Good=4, Easy=5).
 * @returns {Object} Updated card.
 */
export function sm2(card, quality) {
  const now = new Date();

  let { interval = 0, repetitions = 0, easeFactor = 2.5 } = card;

  if (quality < 3) {
    // If answer was incorrect, reset repetitions
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;

    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }

    // Update ease factor
    easeFactor =
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    if (easeFactor < 1.3) easeFactor = 1.3;
  }

  const dueDate = new Date(
    now.getTime() + interval * 24 * 60 * 60 * 1000
  ).toISOString();

  return {
    ...card,
    interval,
    repetitions,
    easeFactor,
    dueDate,
  };
}

/**
 * Get cards that are due for review.
 *
 * @param {Array} cards - All cards.
 * @returns {Array} Cards that are due now.
 */
export function getReviewQueue(cards) {
  const now = new Date();
  return cards.filter((card) => !card.dueDate || new Date(card.dueDate) <= now);
}
