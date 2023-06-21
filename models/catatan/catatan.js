const db = require("../../config/db")

const catatanModel = {
  getCatatan: (callback) => {
    db.query("SELECT * FROM catatan", (error, results) => {
      if (error) {
        return callback(error, null);
      }
      if (results.length === 0) {
        return callback(null, []);
      }
      return callback(null, results);
    });
  }
};

module.exports = catatanModel;