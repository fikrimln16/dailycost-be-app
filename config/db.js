// database.js

const mysql = require('mysql');

// Konfigurasi database
const dbConfig = {
  host: 'localhost',
  user: 'root',
  database: 'daily-cost',
};

// Buat koneksi database
const db = mysql.createConnection(dbConfig);

// Terapkan koneksi database
db.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
  } else {
    console.log('Connected to the database');
  }
});

module.exports = db;
