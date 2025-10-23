const Card = require("../models/Card");
const Deck = require("../models/Deck");
const Review = require("../models/Review");
const { updateCardSrs } = require("../utils/srs");

/**
 * Submit rating for a card (user reviewed a card)
 * body: { rating: "again"|"hard"|"good"|"easy" }
 */
async function reviewCard(req, res) {
  const { cardId } = req.params;
  const { rating } = req.body;
  if (!rating) return res.status(400).json({ error: "Rating required" });

  const card = await Card.findById(cardId);
  if (!card) return res.status(404).json({ error: "Card not found" });
  if (!card.owner.equals(req.user._id))
    return res.status(403).json({ error: "Forbidden" });

  // compute updated scheduling
  const {
    efBefore,
    efAfter,
    intervalBefore,
    intervalAfter,
    repsBefore,
    repsAfter,
    nextReview,
  } = updateCardSrs(card, rating);

  // persist
  card.easeFactor = efAfter;
  card.interval = intervalAfter;
  card.reps = repsAfter;
  card.nextReview = nextReview;
  await card.save();

  // log review history
  const deck = await Deck.findById(card.deckId);
  const r = new Review({
    user: req.user._id,
    card: card._id,
    deck: card.deckId,
    rating,
    efBefore,
    efAfter,
    intervalBefore,
    intervalAfter,
    repsBefore,
    repsAfter,
  });
  await r.save();

  res.json({ card, review: r });
}

/**
 * Get due cards for today for a deck (optional)
 */
async function getDueCards(req, res) {
  const { deckId } = req.params;
  const deck = await Deck.findOne({ _id: deckId, owner: req.user._id });
  if (!deck) return res.status(404).json({ error: "Deck not found" });

  const now = new Date();
  const cards = await Card.find({
    deckId: deck._id,
    owner: req.user._id,
    nextReview: { $lte: now },
  }).lean();

  res.json({ cards });
}

module.exports = { reviewCard, getDueCards };
