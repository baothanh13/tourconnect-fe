require("dotenv").config();
const mysql = require("mysql2/promise");

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Limit connections
  queueLimit: 0,
};

// Create a connection pool instead of individual connections
const pool = mysql.createPool(config);

async function connectToDB() {
  try {
    const connection = await pool.getConnection();
    connection.release(); // Always release the connection back to pool
    return pool; // Return the pool for queries
  } catch (err) {}
}

// Export the pool directly for queries
module.exports = {
  connectToDB,
  pool, // Export pool for direct use
};
