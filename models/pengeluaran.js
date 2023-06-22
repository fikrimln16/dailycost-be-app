const db = require("../config/db");

const pengeluaranModel = {
	dataPengeluaran: (user_id, pengeluaran_id, callback) => {
		db.query(
			"SELECT jumlah, pembayaran FROM pengeluaran WHERE user_id = ? AND pengeluaran_id = ?",
			[user_id, pengeluaran_id],
			(error, result) => {
				if (error) {
					return callback("Terjadi kesalahan pada server!", null, 500);
				}
				return callback(null, result, 200);
			}
		);
	},
	getSaldo: (user_id, callback) => {
		db.query(
			"SELECT uang_gopay, uang_cash, uang_rekening FROM tabungan WHERE id = ?",
			[user_id],
			(error, results) => {
				if (error) {
					return callback(error, null, 500);
				}

				if (results.length === 0) {
					return callback(error, null, 401);
				}

				return callback(null, results, 200);
			}
		);
	},
	restoreSaldo: (user_id, uang_gopay, uang_cash, uang_rekening, callback) => {
		db.query(
			"UPDATE tabungan SET uang_gopay=?, uang_cash=?, uang_rekening=? WHERE id=?",
			[uang_gopay, uang_cash, uang_rekening, user_id],
			(error, result) => {
				if (error) {
					return callback("Terjadi kesalahan pada server saat restore saldo pengeluaran!", null, 500);
				}
				return callback(null, "Berhasil restore pengeluaran dan saldo!", 200);
			}
		);
	},
	deletePengeluaran: (user_id, pengeluaran_id, callback) => {
		db.query(
			"DELETE FROM pengeluaran WHERE user_id = ? AND pengeluaran_id = ?",
			[user_id, pengeluaran_id],
			(error, result) => {
				if (error) {
					return callback("Terjadi kesalahan pada server saat delete pengeluaran!", null, 500);
				}
				return callback(null, "Berhasil restore pengeluaran user!", 200);
			}
		);
	},
};

module.exports = pengeluaranModel;
