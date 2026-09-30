const express = require("express");

const {
  unlockScroll,
  getScrollBalance,
  startScrollSession,
  endScrollSession,
} = require("../controllers/scrollController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/unlock", authenticateToken, unlockScroll);
router.get("/balance", authenticateToken, getScrollBalance);

router.post("/end", authenticateToken, endScrollSession);

module.exports = router;
