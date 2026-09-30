const express = require("express");
const { getAnalytics } = require("../controllers/analyticsController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, getAnalytics);

module.exports = router;
