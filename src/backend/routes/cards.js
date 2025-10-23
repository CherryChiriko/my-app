const express = require("express");
const auth = require("../middleware/auth");
const { reviewCard, getDueCards } = require("../controllers/cardController");

const router = express.Router();
router.use(auth);

router.post("/:cardId/review", reviewCard);
router.get("/deck/:deckId/due", getDueCards);

module.exports = router;
