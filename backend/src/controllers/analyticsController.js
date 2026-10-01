const pool = require("../config/db");

const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [scrollRows] = await pool.query(
      `SELECT
         COALESCE(SUM(duration_seconds), 0) AS total_scroll_seconds,
         COUNT(*) AS total_scroll_sessions,
         SUM(
           CASE
             WHEN intentionality = 'intentional' THEN 1
             ELSE 0
           END
         ) AS intentional_sessions,
         SUM(
           CASE
             WHEN intentionality = 'habitual' THEN 1
             ELSE 0
           END
         ) AS habitual_sessions
       FROM scroll_sessions
       WHERE user_id = ?
         AND ended_at IS NOT NULL`,
      [userId],
    );

    const [brainGymRows] = await pool.query(
      `SELECT
         COUNT(*) AS brain_gym_sessions,
         COALESCE(SUM(questions_answered), 0) AS questions_answered,
         COALESCE(SUM(correct_answers), 0) AS correct_answers
       FROM brain_gym_sessions
       WHERE user_id = ?
         AND completed = TRUE`,
      [userId],
    );
    const [focusForgeRows] = await pool.query(
      `SELECT
     COUNT(*) AS sessions,
     COALESCE(SUM(rounds_played), 0) AS rounds_played,
     COALESCE(SUM(rounds_completed), 0) AS rounds_completed,
     COALESCE(AVG(score), 0) AS average_score,
     COALESCE(SUM(tokens_earned), 0) AS tokens_earned
   FROM focus_game_sessions
   WHERE user_id = ?`,
      [userId],
    );

    const [unlockRows] = await pool.query(
      `SELECT
         COUNT(*) AS total_unlocks,
         COALESCE(SUM(scroll_minutes), 0) AS total_unlocked_minutes
       FROM unlock_events
       WHERE user_id = ?`,
      [userId],
    );

    const [tokenRows] = await pool.query(
      `SELECT balance
       FROM user_tokens
       WHERE user_id = ?`,
      [userId],
    );

    const totalScrollSeconds = Number(scrollRows[0].total_scroll_seconds);

    const scrollMinutes = Math.floor(totalScrollSeconds / 60);

    const questionsAnswered = Number(brainGymRows[0].questions_answered);

    const correctAnswers = Number(brainGymRows[0].correct_answers);

    const brainGymAccuracy =
      questionsAnswered > 0
        ? Number(((correctAnswers / questionsAnswered) * 100).toFixed(1))
        : null;

    const tokenBalance =
      tokenRows.length > 0 ? Number(tokenRows[0].balance) : 0;

    res.json({
      scroll: {
        minutes: scrollMinutes,
        sessions: Number(scrollRows[0].total_scroll_sessions),
        intentionalSessions: Number(scrollRows[0].intentional_sessions || 0),
        habitualSessions: Number(scrollRows[0].habitual_sessions || 0),
      },

      brainGym: {
        sessions: Number(brainGymRows[0].brain_gym_sessions),
        questionsAnswered,
        correctAnswers,
        accuracy: brainGymAccuracy,
      },
      focusForge: {
        sessions: Number(focusForgeRows[0].sessions),
        roundsPlayed: Number(focusForgeRows[0].rounds_played),
        roundsCompleted: Number(focusForgeRows[0].rounds_completed),
        averageScore: Number(
          Number(focusForgeRows[0].average_score).toFixed(1),
        ),
        tokensEarned: Number(focusForgeRows[0].tokens_earned),
      },

      unlocks: {
        total: Number(unlockRows[0].total_unlocks),
        minutes: Number(unlockRows[0].total_unlocked_minutes),
      },

      tokenBalance,
    });
  } catch (error) {
    console.error("Analytics error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAnalytics,
};
