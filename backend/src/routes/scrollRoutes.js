const express = require("express");

const {
  unlockScroll,
  getScrollBalance,
  endScrollSession,
  getScrollSessionStatus,
} = require("../controllers/scrollController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/unlock", authenticateToken, unlockScroll);
router.get("/balance", authenticateToken, getScrollBalance);
router.get("/session/:sessionId", authenticateToken, getScrollSessionStatus);
router.post("/end", authenticateToken, endScrollSession);

module.exports = router;
