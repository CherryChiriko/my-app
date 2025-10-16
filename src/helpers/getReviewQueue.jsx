export const getReviewQueue = (allCards) => {
  const now = new Date();
  // Set to midnight for a fair comparison of 'due' dates
  now.setHours(0, 0, 0, 0);

  // Filter cards whose 'due' date is today or in the past
  const dueCards = allCards.filter((card) => {
    // A card is new if it has no due date or interval is 0 (first review)
    if (!card.due || card.interval === 0) {
      return true;
    }

    const dueDate = new Date(card.due);
    dueDate.setHours(0, 0, 0, 0); // Normalize due date to midnight

    return dueDate <= now;
  });

  // Optional: Shuffle the queue for better randomness
  const shuffledQueue = [...dueCards].sort(() => Math.random() - 0.5);

  return shuffledQueue;
};
