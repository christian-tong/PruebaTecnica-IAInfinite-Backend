const { getConnection } = require("../services/dbService");

const saveToken = async (token) => {
  const db = await getConnection();
  await db.execute("INSERT INTO tokens (token) VALUES (?)", [token]);
};

const getToken = async (token) => {
  const db = await getConnection();
  const [rows] = await db.execute("SELECT * FROM tokens WHERE token = ?", [
    token,
  ]);
  return rows.length > 0 ? rows[0] : null;
};

module.exports = { saveToken, getToken };
