const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  // password: '@Fikrimln16',
  database: "daily-cost",
});

module.exports = db;
