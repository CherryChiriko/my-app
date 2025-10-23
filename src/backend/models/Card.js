const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    deckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deck",
      required: true,
    },
    front: { type: String, required: true },
    back: { type: String, required: true },
    reading: { type: String },
    // SRS fields
    easeFactor: { type: Number, default: 2.5 }, // SM-2 default
    interval: { type: Number, default: 0 }, // days
    reps: { type: Number, default: 0 }, // consecutive successful reps
    nextReview: { type: Date, default: Date.now },
    // optional owner to filter per-user data on shared decks
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", cardSchema);
