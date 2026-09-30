const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    userId: req.user.userId,
  });
});

module.exports = router;
