const pool = require("../config/db");

const getTokenBalance = async (userId, connection = pool) => {
  const [rows] = await connection.query(
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

const addTokens = async (userId, amount, connection = pool) => {
  if (amount <= 0) {
    throw new Error("Token amount must be positive");
  }

  const [result] = await connection.query(
    `UPDATE user_tokens
     SET balance = balance + ?
     WHERE user_id = ?`,
    [amount, userId],
  );

  if (result.affectedRows === 0) {
    throw new Error("Token account not found");
  }

  return getTokenBalance(userId, connection);
};

const spendTokens = async (userId, amount, connection = pool) => {
  if (amount <= 0) {
    throw new Error("Token amount must be positive");
  }

  const [result] = await connection.query(
    `UPDATE user_tokens
     SET balance = balance - ?
     WHERE user_id = ?
       AND balance >= ?`,
    [amount, userId, amount],
  );

  if (result.affectedRows === 0) {
    throw new Error("Insufficient tokens");
  }

  return getTokenBalance(userId, connection);
};

module.exports = {
  getTokenBalance,
  addTokens,
  spendTokens,
};
