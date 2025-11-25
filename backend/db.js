const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

// MySQL connection setup
const connection = mysql.createConnection({
  host: process.env.DB_HOST, // Use environment variables for sensitive information
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

connection.connect(err => {
  if (err) console.error('DB connection failed:', err);
  else console.log('Connected to MySQL');
});

const db = connection;

db.on('error', err => {
  console.error('MySQL error', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') process.exit(1);
});

module.exports = { db};