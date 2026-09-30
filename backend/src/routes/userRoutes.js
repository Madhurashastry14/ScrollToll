const express = require("express");

const pool = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT id, name, email, created_at
       FROM users
       WHERE id = ?`,
      [req.user.userId],
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user: users[0],
    });
  } catch (error) {
    console.error("Profile error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
