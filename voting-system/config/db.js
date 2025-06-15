const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  // This is creating the connection for the DB
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "voting_db",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
