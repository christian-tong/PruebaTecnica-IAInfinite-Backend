const mysql = require("mysql2/promise");

const getConnection = async () => {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "prueba_tecnica_db",
  });
};

module.exports = { getConnection };
