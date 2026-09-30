const pool = require("../config/db");

const getTokenBalance = async (userId) => {
  const [rows] = await pool.query(
    `SELECT balance
     FROM user_tokens
     WHERE user_id = ?`,
    [userId],
  );

  if (rows.length === 0) {
    throw new Error("Token account not found");
  }

  return rows[0].balance;
};

const addTokens = async (userId, amount) => {
  if (amount <= 0) {
    throw new Error("Token amount must be positive");
  }

  const [result] = await pool.query(
    `UPDATE user_tokens
     SET balance = balance + ?
     WHERE user_id = ?`,
    [amount, userId],
  );

  if (result.affectedRows === 0) {
    throw new Error("Token account not found");
  }

  return getTokenBalance(userId);
};

const spendTokens = async (userId, amount) => {
  if (amount <= 0) {
    throw new Error("Token amount must be positive");
  }

  const [result] = await pool.query(
    `UPDATE user_tokens
     SET balance = balance - ?
     WHERE user_id = ?
       AND balance >= ?`,
    [amount, userId, amount],
  );

  if (result.affectedRows === 0) {
    throw new Error("Insufficient tokens");
  }

  return getTokenBalance(userId);
};

module.exports = {
  getTokenBalance,
  addTokens,
  spendTokens,
};
