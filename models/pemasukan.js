const db = require("../config/db");

const pemasukanModel = {
  dataPemasukan: (user_id, callback) => {
    db.query(
			"SELECT * FROM pemasukan WHERE user_id = ?",
			[user_id],
			(error, result) => {
				if (error) {
					return callback("Terjadi kesalahan pada server!", null, 500);
				}
				return callback(null, result, 200);
			}
		);
  },
}

module.exports = pemasukanModel