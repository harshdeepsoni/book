const mysql  = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
  host            : process.env.DB_HOST     || "localhost",
  port            : process.env.DB_PORT     || 3306,
  user            : process.env.DB_USER     || "root",
  password        : process.env.DB_PASSWORD || "",
  database        : process.env.DB_NAME     || "bookhaven",
  waitForConnections: true,
  connectionLimit : 10,
  queueLimit      : 0,
  timezone        : "+00:00"
});

// Test connection on startup
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅  MySQL connected → database:", process.env.DB_NAME || "bookhaven");
    conn.release();
  } catch (err) {
    console.error("❌  MySQL connection failed:", err.message);
    console.log("💡  Check your .env: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME");
  }
})();

module.exports = pool;
