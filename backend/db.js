const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();
const connection = mysql.createConnection({
  host: 'sql5.freesqldatabase.com',
  user: 'sql5764904',
  port: 3306,
  password: 'ZhPF13x6SU',
  database: 'sql5764904'
});

connection.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
  } else {
    console.log('Connected to MySQL database!');
  }
});

connection.on('error', err => {
  console.error('MySQL error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') process.exit(1);
});

const db = connection;
const pdb = connection.promise();

module.exports = { db, pdb };
