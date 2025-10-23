const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  card: { type: mongoose.Schema.Types.ObjectId, ref: "Card", required: true },
  deck: { type: mongoose.Schema.Types.ObjectId, ref: "Deck" },
  rating: {
    type: String,
    enum: ["again", "hard", "good", "easy"],
    required: true,
  },
  efBefore: Number,
  efAfter: Number,
  intervalBefore: Number,
  intervalAfter: Number,
  repsBefore: Number,
  repsAfter: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);
