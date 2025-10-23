const express = require("express");
const auth = require("../middleware/auth");
const {
  getUserDecks,
  createDeck,
  getDeckCards,
} = require("../controllers/deckController");

const router = express.Router();

router.use(auth);
router.get("/", getUserDecks);
router.post("/", createDeck);
router.get("/:deckId/cards", getDeckCards);

module.exports = router;
