const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [focusRows] = await pool.query(
      `SELECT COALESCE(SUM(duration_seconds), 0) AS total_focus_seconds
       FROM focus_sessions
       WHERE user_id = ?
         AND completed = TRUE`,
      [userId],
    );

    const [scrollRows] = await pool.query(
      `SELECT COALESCE(SUM(duration_seconds), 0) AS total_scroll_seconds
       FROM scroll_sessions
       WHERE user_id = ?
         AND ended_at IS NOT NULL`,
      [userId],
    );

    const [tokenRows] = await pool.query(
      `SELECT balance
       FROM user_tokens
       WHERE user_id = ?`,
      [userId],
    );

    const totalScrollSeconds = Number(scrollRows[0].total_scroll_seconds);

    const balance = tokenRows.length > 0 ? Number(tokenRows[0].balance) : 0;

    res.json({
      scrollTimeMinutes: Math.floor(totalScrollSeconds / 60),
      tokenBalance: balance,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
module.exports = {
  getDashboardStats,
};
