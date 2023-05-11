const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'dailycos_fikri',
    password: '@Fikrimln16',
    database: 'dailycos_api'
});

module.exports = db;