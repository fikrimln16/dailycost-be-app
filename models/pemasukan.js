const db = require("../config/db");
const depoModel = require("../models/depo");

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
  dataPemasukanId: (user_id, pemasukan_id, callback) => {
		db.query(
			"SELECT * FROM pemasukan WHERE user_id = ? AND pemasukan_id = ?",
			[user_id, pemasukan_id],
			(error, result) => {
				if (error) {
					return callback("Terjadi kesalahan pada server!", null, 500);
				}
				return callback(null, result, 200);
			}
		);
	},
  deletePemasukan: (user_id, pemasukan_id, callback) => {
		db.query(
			"DELETE FROM pemasukan WHERE user_id = ? AND pemasukan_id = ?",
			[user_id, pemasukan_id],
			(error, result) => {
				if (error) {
					return callback(
						"Terjadi kesalahan pada server saat delete pemasukan!",
						null,
						500
					);
				}
				return callback(null, "Berhasil restore pemasukan user!", 200);
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
					return callback(
						"Terjadi kesalahan pada server saat restore saldo pengeluaran!",
						null,
						500
					);
				}
				return callback(null, "Berhasil restore pengeluaran dan saldo!", 200);
			}
		);
	},
	postPemasukan: (
		nama,
		tanggal,
		jumlah,
		pembayaran,
		user_id,
		kategori,
		callback
	) => {
		if (
			pembayaran === "GOPAY" ||
			pembayaran === "CASH" ||
			pembayaran === "REKENING"
		) {
			db.query(
				"INSERT INTO pemasukan VALUES(null, ?, ?, ?, ?, ?, ?) ",
				[nama, tanggal, jumlah, pembayaran, user_id, kategori],
				(error, results) => {
					if (error) {
						return callback(error, null, 401);
					}

          if(pembayaran === "GOPAY"){
            //topup gopay
            depoModel.topUp(
              user_id,
              jumlah,
              0,
              0,
              (error, saldoUser, statusCode) => {
                if (statusCode === 401) {
                  return callback(error, null, 401);
                }
                if (error) {
                  return callback(error, null, 500);
                }
                return callback(null, saldoUser, 200)
              }
            );
          } else if(pembayaran === "CASH"){
            //topup cash
            depoModel.topUp(
              user_id,
              0,
              jumlah,
              0,
              (error, saldoUser, statusCode) => {
                if (statusCode === 401) {
                  return callback(error, null, 401);
                }
                if (error) {
                  return callback(error, null, 500);
                }
                return callback(null, saldoUser, 200)
              }
            );
          } else {
            //topup rekening
            depoModel.topUp(
              user_id,
              0,
              0,
              jumlah,
              (error, saldoUser, statusCode) => {
                if (statusCode === 401) {
                  return callback(error, null, 401);
                }
                if (error) {
                  return callback(error, null, 500);
                }
  
                return callback(null, saldoUser, 200)
              }
            );
          }
				}
			);
		} else {
			return callback(
				"Metode pembayaran tidak valid",
				"Metode pembayaran tidak valid, mohon masukkan data seperti `GOPAY`, `CASH`, atau `REKENING`.",
				400
			);
		}
	},
};

module.exports = pemasukanModel;
