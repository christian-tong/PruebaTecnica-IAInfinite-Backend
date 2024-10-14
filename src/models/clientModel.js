const { getConnection } = require("../services/dbService");

const saveClient = async (clientData) => {
  const db = await getConnection();
  await db.execute("INSERT INTO clients (name, email) VALUES (?, ?)", [
    clientData.name,
    clientData.email,
  ]);
};

module.exports = { saveClient };
