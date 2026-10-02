// event_db.js
// Creates the MySQL connection pool used by the API and exposes a
// connectivity check.

const mysql = require('mysql2/promise');
const dbDetails = require('./db-details');

const pool = mysql.createPool({
  ...dbDetails,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,      // return DATE/DATETIME values as 'YYYY-MM-DD' strings
  decimalNumbers: true,   // return DECIMAL values as numbers instead of strings
  charset: 'utf8mb4'
});

// Queries the server version and current database to confirm the connection.
async function testConnection() {
  const [rows] = await pool.query('SELECT VERSION() AS version, DATABASE() AS db');
  console.log('Connected to MySQL', rows[0].version, '| database:', rows[0].db);
}

// Running "node event_db.js" directly performs the connectivity check.
if (require.main === module) {
  testConnection()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Connection failed:', err.message);
      process.exit(1);
    });
}

module.exports = { pool, testConnection };
