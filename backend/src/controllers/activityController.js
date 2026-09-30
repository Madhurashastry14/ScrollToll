const pool = require("../config/db");
const { addTokens } = require("../services/tokenService");

const completeBrainGym = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { questionsAnswered, correctAnswers } = req.body;

    if (
      !Number.isInteger(questionsAnswered) ||
      !Number.isInteger(correctAnswers)
    ) {
      return res.status(400).json({
        message: "Invalid activity data",
      });
    }

    if (questionsAnswered <= 0) {
      return res.status(400).json({
        message: "Questions answered must be greater than zero",
      });
    }

    if (correctAnswers < 0 || correctAnswers > questionsAnswered) {
      return res.status(400).json({
        message: "Invalid correct answer count",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO brain_gym_sessions
       (user_id, questions_answered, correct_answers, completed)
       VALUES (?, ?, ?, TRUE)`,
      [userId, questionsAnswered, correctAnswers],
    );

    const tokensEarned = Math.max(
      1,
      Math.floor((correctAnswers / questionsAnswered) * 5),
    );

    const newBalance = await addTokens(userId, tokensEarned);

    res.status(201).json({
      message: "Brain Gym completed",
      session: {
        id: result.insertId,
        questionsAnswered,
        correctAnswers,
      },
      tokensEarned,
      balance: newBalance,
    });
  } catch (error) {
    console.error("Brain Gym error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
const completeFocusForge = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { durationSeconds } = req.body;

    if (!Number.isInteger(durationSeconds)) {
      return res.status(400).json({
        message: "Invalid focus duration",
      });
    }

    if (durationSeconds < 60) {
      return res.status(400).json({
        message: "Focus session must be at least 60 seconds",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO focus_sessions
       (user_id, duration_seconds, completed)
       VALUES (?, ?, TRUE)`,
      [userId, durationSeconds],
    );

    // 1 token for every completed minute,
    // capped at 5 tokens per session.
    const minutes = Math.floor(durationSeconds / 60);

    const tokensEarned = Math.min(minutes, 5);

    const newBalance = await addTokens(userId, tokensEarned);

    res.status(201).json({
      message: "Focus session completed",
      session: {
        id: result.insertId,
        durationSeconds,
      },
      tokensEarned,
      balance: newBalance,
    });
  } catch (error) {
    console.error("Focus Forge error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
const completeMindfulMinute = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { durationSeconds } = req.body;

    if (!Number.isInteger(durationSeconds)) {
      return res.status(400).json({
        message: "Invalid mindful session duration",
      });
    }

    if (durationSeconds < 60) {
      return res.status(400).json({
        message: "Mindful session must be at least 60 seconds",
      });
    }

    const tokensEarned = 1;

    const newBalance = await addTokens(userId, tokensEarned);

    res.status(201).json({
      message: "Mindful Minute completed",
      durationSeconds,
      tokensEarned,
      balance: newBalance,
    });
  } catch (error) {
    console.error("Mindful Minute error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  completeBrainGym,
  completeFocusForge,
  completeMindfulMinute,
};
