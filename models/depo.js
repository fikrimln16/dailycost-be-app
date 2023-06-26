const db = require("../config/db");

const depoModel = {
	topUp: (id, uang_gopay, uang_cash, uang_rekening, callback) => {
		db.query(
			"SELECT uang_gopay, uang_cash, uang_rekening FROM tabungan WHERE id = ?",
			[id],
			(error, results) => {
				if (error) {
					return callback(error, null, 500);
				}

				if (results.length === 0) {
					return callback("Mohon masukkan data user_id yang benar!", null, 401);
				}

				const uang_gopay_old = results[0].uang_gopay;
				const uang_cash_old = results[0].uang_cash;
				const uang_rekening_old = results[0].uang_rekening;

				const uang_gopay_new = parseInt(uang_gopay) + uang_gopay_old;
				const uang_cash_new = parseInt(uang_cash) + uang_cash_old;
				const uang_rekening_new = parseInt(uang_rekening) + uang_rekening_old;

				db.query(
					"UPDATE tabungan SET uang_gopay=?, uang_cash=?, uang_rekening=? WHERE id=?",
					[uang_gopay_new, uang_cash_new, uang_rekening_new, id],
					(error, results) => {
						if (error) {
							return callback(error, null, 500);
						}

						if (results.length === 0) {
							return callback("Mohon masukkan data user_id yang benar!", null, 401);
						}

						const saldoUser = {
							user_id: id,
							uang_gopay: uang_gopay_new,
							uang_cash: uang_cash_new,
							uang_rekening: uang_rekening_new,
						};

						callback(null, saldoUser, 200);
					}
				);
			}
		);
	},
	newDepo: (id, uang_gopay, uang_cash, uang_rekening, callback) => {
		db.query(
			"INSERT INTO tabungan VALUES (?, ?, ?, ?)",
			[id, uang_gopay, uang_cash, uang_rekening],
			(error, results) => {
				if (error) {
					console.error(error);
					return callback(error, null);
				}

				if (results.length === 0) {
					return callback(new Error("Terjadi kesalahan input!"), null);
				}

				const saldoUser = {
					user_id: id,
					uang_gopay: uang_gopay,
					uang_cash: uang_cash,
					uang_rekening: uang_rekening,
				};

				callback(null, saldoUser);
			}
		);
	},
	editDepo: (id, uang_gopay, uang_cash, uang_rekening, callback) => {
		db.query(
			"UPDATE tabungan SET uang_gopay = ?, uang_cash = ?, uang_rekening = ? WHERE id = ?",
			[uang_gopay, uang_cash, uang_rekening, id],
			(error, results) => {
				if (error) {
					return callback(error, null);
				}

				const saldoUser = {
					uang_gopay,
					uang_cash,
					uang_rekening,
				};

				callback(null, saldoUser);
			}
		);
	},
	getSaldo: (id, callback) => {
		db.query(
			"SELECT id as user_id, uang_gopay, uang_cash, uang_rekening FROM tabungan WHERE id = ?",
			[id],
			(error, results) => {
				if (error) {
					console.error(error);
					return callback(error, null, 500);
				}

				if (results.length === 0) {
					return callback(error, null, 404);
				}

				const saldo = {
					user_id: results[0].user_id,
					uang_gopay: results[0].uang_gopay,
					uang_cash: results[0].uang_cash,
					uang_rekening: results[0].uang_rekening,
				};

				callback(null, saldo, 200);
			}
		);
	},
};

module.exports = depoModel;
