const mysql = require('mysql2');

// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST, // Use environment variables for sensitive information
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

db.connect(err => {
  if (err) console.error('DB connection failed:', err);
  else console.log('Connected to MySQL');
});

db.on('error', err => {
  console.error('MySQL error', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') process.exit(1);
});

module.exports = { db };