const pool = require("../config/db");
const { spendTokens, getTokenBalance } = require("../services/tokenService");

const getScrollBalance = async (req, res) => {
  try {
    const userId = req.user.userId;

    const balance = await getTokenBalance(userId);

    res.json({
      balance,
    });
  } catch (error) {
    console.error("Scroll balance error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const startScrollSession = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [result] = await pool.query(
      `INSERT INTO scroll_sessions
       (user_id, started_at, duration_seconds, intentionality)
       VALUES (?, NOW(), 0, 'unknown')`,
      [userId],
    );

    res.status(201).json({
      message: "Scroll session started",
      sessionId: result.insertId,
    });
  } catch (error) {
    console.error("Scroll session start error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
const endScrollSession = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      sessionId,
      intentionality = "intentional",
      reason = null,
    } = req.body;

    if (!Number.isInteger(sessionId)) {
      return res.status(400).json({
        message: "Invalid scroll session",
      });
    }

    const [sessions] = await pool.query(
      `SELECT id, started_at, ended_at
       FROM scroll_sessions
       WHERE id = ?
         AND user_id = ?`,
      [sessionId, userId],
    );

    if (sessions.length === 0) {
      return res.status(404).json({
        message: "Scroll session not found",
      });
    }

    const session = sessions[0];

    if (session.ended_at) {
      return res.status(400).json({
        message: "Scroll session has already ended",
      });
    }

    const validIntentionality = ["intentional", "habitual", "unknown"];

    const finalIntentionality = validIntentionality.includes(intentionality)
      ? intentionality
      : "unknown";

    const [result] = await pool.query(
      `UPDATE scroll_sessions
       SET ended_at = NOW(),
           duration_seconds = TIMESTAMPDIFF(
             SECOND,
             started_at,
             NOW()
           ),
           intentionality = ?,
           reason = ?
       WHERE id = ?
         AND user_id = ?
         AND ended_at IS NULL`,
      [finalIntentionality, reason, sessionId, userId],
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Unable to end scroll session",
      });
    }

    const [updatedSessions] = await pool.query(
      `SELECT duration_seconds
       FROM scroll_sessions
       WHERE id = ?`,
      [sessionId],
    );

    res.json({
      message: "Scroll session ended",
      durationSeconds: updatedSessions[0].duration_seconds,
    });
  } catch (error) {
    console.error("Scroll session end error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
const unlockScroll = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const userId = req.user.userId;
    const { scrollMinutes } = req.body;

    const allowedDurations = [2, 4, 6, 8, 10];

    if (!Number.isInteger(scrollMinutes)) {
      return res.status(400).json({
        message: "Scroll duration must be an integer",
      });
    }

    if (!allowedDurations.includes(scrollMinutes)) {
      return res.status(400).json({
        message: "Invalid scroll duration",
      });
    }

    const tokenCost = scrollMinutes / 2;

    await connection.beginTransaction();

    const [tokenRows] = await connection.query(
      `SELECT balance
       FROM user_tokens
       WHERE user_id = ?
       FOR UPDATE`,
      [userId],
    );

    if (tokenRows.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        message: "Token account not found",
      });
    }

    const currentBalance = Number(tokenRows[0].balance);

    if (currentBalance < tokenCost) {
      await connection.rollback();

      return res.status(403).json({
        message: "Not enough Scroll Tokens",
        balance: currentBalance,
        required: tokenCost,
      });
    }

    const newBalance = currentBalance - tokenCost;

    await connection.query(
      `UPDATE user_tokens
       SET balance = ?
       WHERE user_id = ?`,
      [newBalance, userId],
    );

    const [unlockResult] = await connection.query(
      `INSERT INTO unlock_events
       (user_id, method, toll_level, scroll_minutes)
       VALUES (?, 'scroll_tokens', ?, ?)`,
      [userId, 1, scrollMinutes],
    );

    const [sessionResult] = await connection.query(
      `INSERT INTO scroll_sessions
       (user_id, started_at, duration_seconds, intentionality)
       VALUES (?, NOW(), 0, 'unknown')`,
      [userId],
    );

    await connection.commit();

    return res.status(201).json({
      message: "Scroll unlocked",
      unlock: {
        id: unlockResult.insertId,
        scrollMinutes,
        tollLevel: 1,
      },
      sessionId: sessionResult.insertId,
      tokenCost,
      balance: newBalance,
    });
  } catch (error) {
    await connection.rollback();

    console.error("Scroll unlock error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    connection.release();
  }
};
module.exports = {
  unlockScroll,
  getScrollBalance,
  startScrollSession,
  endScrollSession,
};
