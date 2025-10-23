const Review = require("../models/Review");
const Card = require("../models/Card");
const Deck = require("../models/Deck");

/**
 * Returns simple stats:
 * - reviewsToday
 * - totalReviews
 * - cardsDueToday
 * - mastery distribution (by reps)
 */
async function getUserStats(req, res) {
  const userId = req.user._id;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const reviewsToday = await Review.countDocuments({
    user: userId,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  const totalReviews = await Review.countDocuments({ user: userId });

  const now = new Date();
  const cardsDue = await Card.countDocuments({
    owner: userId,
    nextReview: { $lte: now },
  });

  // mastery distribution by reps (simple bucketing)
  const buckets = await Card.aggregate([
    { $match: { owner: userId } },
    { $group: { _id: "$reps", count: { $sum: 1 } } },
  ]);

  const decks = await Deck.find({ owner: userId }).lean();

  res.json({
    reviewsToday,
    totalReviews,
    cardsDue,
    masteryBuckets: buckets,
    deckCount: decks.length,
  });
}

module.exports = { getUserStats };
