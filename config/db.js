const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "daily-cost",
});

module.exports = db;
