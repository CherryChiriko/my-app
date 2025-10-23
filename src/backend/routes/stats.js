const express = require("express");
const auth = require("../middleware/auth");
const { getUserStats } = require("../controllers/statsController");

const router = express.Router();
router.use(auth);

router.get("/", getUserStats);

module.exports = router;
