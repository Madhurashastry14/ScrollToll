const pool = require("../config/db");
const { addTokens } = require("../services/tokenService");

const startBrainGym = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { domain } = req.body;

    const validDomains = [
      "logic",
      "patterns",
      "quick_math",
      "memory",
      "attention",
    ];

    if (!validDomains.includes(domain)) {
      return res.status(400).json({
        message: "Invalid Brain Gym domain",
      });
    }

    const [questions] = await pool.query(
      `SELECT
        id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        difficulty
       FROM brain_gym_questions
       WHERE domain = ?
       ORDER BY RAND()
       LIMIT 3`,
      [domain],
    );

    if (questions.length < 3) {
      return res.status(500).json({
        message: "Not enough questions available for this domain",
      });
    }

    const questionIds = questions.map((question) => question.id);

    const [result] = await pool.query(
      `INSERT INTO brain_gym_attempts
       (user_id, domain, question_ids)
       VALUES (?, ?, ?)`,
      [userId, domain, JSON.stringify(questionIds)],
    );

    res.status(201).json({
      message: "Brain Gym started",
      attemptId: result.insertId,
      domain,
      questions,
    });
  } catch (error) {
    console.error("Brain Gym start error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const submitBrainGym = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { attemptId, answers } = req.body;

    if (!Number.isInteger(attemptId) || !Array.isArray(answers)) {
      return res.status(400).json({
        message: "Invalid Brain Gym submission",
      });
    }

    const [attempts] = await pool.query(
      `SELECT id, domain, question_ids, completed
       FROM brain_gym_attempts
       WHERE id = ?
         AND user_id = ?`,
      [attemptId, userId],
    );

    if (attempts.length === 0) {
      return res.status(404).json({
        message: "Brain Gym attempt not found",
      });
    }

    const attempt = attempts[0];

    if (attempt.completed) {
      return res.status(400).json({
        message: "This Brain Gym attempt has already been completed",
      });
    }

    const questionIds =
      typeof attempt.question_ids === "string"
        ? JSON.parse(attempt.question_ids)
        : attempt.question_ids;

    if (!Array.isArray(questionIds) || questionIds.length !== 3) {
      return res.status(400).json({
        message: "Invalid Brain Gym question set",
      });
    }

    if (answers.length !== questionIds.length) {
      return res.status(400).json({
        message: "All Brain Gym questions must be answered",
      });
    }

    const validAnswers = ["A", "B", "C", "D"];

    const submittedQuestionIds = answers.map((answer) => answer.questionId);

    const uniqueQuestionIds = new Set(submittedQuestionIds);

    if (uniqueQuestionIds.size !== questionIds.length) {
      return res.status(400).json({
        message: "Each Brain Gym question can only be answered once",
      });
    }

    const allQuestionsBelongToAttempt = submittedQuestionIds.every(
      (questionId) => questionIds.includes(questionId),
    );

    if (!allQuestionsBelongToAttempt) {
      return res.status(400).json({
        message: "Invalid Brain Gym question submitted",
      });
    }

    const allAnswersValid = answers.every((answer) =>
      validAnswers.includes(answer.answer),
    );

    if (!allAnswersValid) {
      return res.status(400).json({
        message: "Invalid answer submitted",
      });
    }

    const [questions] = await pool.query(
      `SELECT
        id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
        explanation,
        difficulty
       FROM brain_gym_questions
       WHERE id IN (?)`,
      [questionIds],
    );

    if (questions.length !== questionIds.length) {
      return res.status(500).json({
        message: "Some Brain Gym questions could not be found",
      });
    }

    const answerMap = new Map(
      answers.map((answer) => [answer.questionId, answer.answer]),
    );

    let correctAnswers = 0;

    const questionResults = questionIds.map((questionId) => {
      const question = questions.find((item) => item.id === questionId);

      const userAnswer = answerMap.get(questionId);
      const isCorrect = userAnswer === question.correct_answer;

      if (isCorrect) {
        correctAnswers++;
      }

      return {
        questionId: question.id,
        question: question.question,
        options: {
          A: question.option_a,
          B: question.option_b,
          C: question.option_c,
          D: question.option_d,
        },
        userAnswer,
        correctAnswer: question.correct_answer,
        isCorrect,
        explanation: question.explanation,
        difficulty: question.difficulty,
      };
    });

    const questionsAnswered = questionIds.length;

    const tokensEarned = Math.max(
      1,
      Math.floor((correctAnswers / questionsAnswered) * 5),
    );

    await pool.query(
      `INSERT INTO brain_gym_sessions
       (user_id, questions_answered, correct_answers, completed)
       VALUES (?, ?, ?, TRUE)`,
      [userId, questionsAnswered, correctAnswers],
    );

    const newBalance = await addTokens(userId, tokensEarned);

    await pool.query(
      `UPDATE brain_gym_attempts
       SET completed = TRUE
       WHERE id = ?`,
      [attemptId],
    );

    res.status(200).json({
      message: "Brain Gym completed",

      result: {
        questionsAnswered,
        correctAnswers,
        tokensEarned,
        balance: newBalance,
        questions: questionResults,
      },
    });
  } catch (error) {
    console.error("Brain Gym submission error:", error);

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
  startBrainGym,
  submitBrainGym,
  completeFocusForge,
  completeMindfulMinute,
};
