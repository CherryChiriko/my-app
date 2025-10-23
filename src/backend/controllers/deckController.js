const Deck = require("../models/Deck");
const Card = require("../models/Card");

async function getUserDecks(req, res) {
  const decks = await Deck.find({ owner: req.user._id }).lean();
  res.json({ decks });
}

async function createDeck(req, res) {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: "Title required" });
  const deck = new Deck({ title, description, owner: req.user._id });
  await deck.save();
  res.json({ deck });
}

async function getDeckCards(req, res) {
  const { deckId } = req.params;
  const deck = await Deck.findOne({ _id: deckId, owner: req.user._id });
  if (!deck) return res.status(404).json({ error: "Deck not found" });
  const cards = await Card.find({
    deckId: deck._id,
    owner: req.user._id,
  }).lean();
  res.json({ deck, cards });
}

module.exports = { getUserDecks, createDeck, getDeckCards };
