const db = require("../config/db");

const pengeluaranModel = {
	postPengeluaran: (nama, tanggal, jumlah, pembayaran, user_id, kategori, callback) => {
    if (
      pembayaran === 'GOPAY' ||
      pembayaran === 'CASH' ||
      pembayaran === 'REKENING'
    ) {
      try {
        db.query(
          'INSERT INTO pengeluaran VALUES(null, ?, ?, ?, ?, ?, ?) ',
          [nama, tanggal, jumlah, pembayaran, user_id, kategori],
          (error, results) => {
            if (error) {
              return callback(error, null);
            }

            db.query(
              `SELECT uang_gopay, uang_cash, uang_rekening FROM tabungan WHERE id = ${user_id}`,
              (error, results) => {
                if (error) {
                  return callback(error, null);
                }

                const uang_gopay = results[0].uang_gopay;
                const uang_cash = results[0].uang_cash;
                const uang_rekening = results[0].uang_rekening;

                if (pembayaran === 'GOPAY') {
                  const uang_gopay_update = uang_gopay - jumlah;
                  db.query(
                    `UPDATE tabungan SET uang_gopay = ${uang_gopay_update} WHERE id = ${user_id}`,
                    (error, results) => {
                      if (error) {
                        return callback(error, null);
                      }
                      return callback(null, 'Berhasil Membeli Barang!');
                    }
                  );
                } else if (pembayaran === 'REKENING') {
                  const uang_rekening_update = uang_rekening - jumlah;
                  db.query(
                    `UPDATE tabungan SET uang_rekening = ${uang_rekening_update} WHERE id = ${user_id}`,
                    (error, results) => {
                      if (error) {
                        return callback(error, null);
                      }
                      return callback(null, 'Berhasil Membeli Barang!');
                    }
                  );
                } else if (pembayaran === 'CASH') {
                  const uang_cash_update = uang_cash - jumlah;
                  db.query(
                    `UPDATE tabungan SET uang_cash = ${uang_cash_update} WHERE id = ${user_id}`,
                    (error, results) => {
                      if (error) {
                        return callback(error, null);
                      }
                      return callback(null, 'Berhasil Membeli Barang!');
                    }
                  );
                }
              }
            );
          }
        );
      } catch (error) {
        return callback(error, null);
      }
    } else {
      return callback('Metode pembayaran tidak valid',"Metode pembayaran tidak valid, mohon masukkan data seperti `GOPAY`, `CASH`, atau `REKENING`.", 400);
    }
  },
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
	deletePengeluaran: (user_id, pengeluaran_id, callback) => {
		db.query(
			"DELETE FROM pengeluaran WHERE user_id = ? AND pengeluaran_id = ?",
			[user_id, pengeluaran_id],
			(error, result) => {
				if (error) {
					return callback(
						"Terjadi kesalahan pada server saat delete pengeluaran!",
						null,
						500
					);
				}
				return callback(null, "Berhasil restore pengeluaran user!", 200);
			}
		);
	},
	getPengeluaranById: (id, callback) => {
		db.query(
			'SELECT pengeluaran_id, nama, DATE_FORMAT(tanggal, "%d %M %Y %H:%i:%s") AS tanggal, jumlah, pembayaran, user_id,  kategori FROM pengeluaran WHERE user_id = ? ORDER BY pengeluaran_id DESC',
			[id],
			(error, results) => {
				if (error) {
					console.error(error);
					return callback(error, null);
				}

				let totalPembayaranGOPAY = 0;
				let totalPembayaranREKENING = 0;
				let totalPembayaranCASH = 0;

				for (let i = 0; i < results.length; i++) {
					if (results[i].pembayaran === "GOPAY") {
						totalPembayaranGOPAY += results[i].jumlah;
					}
					if (results[i].pembayaran === "REKENING") {
						totalPembayaranREKENING += results[i].jumlah;
					}
					if (results[i].pembayaran === "CASH") {
						totalPembayaranCASH += results[i].jumlah;
					}
				}

				const pengeluaran = {
					pengeluaran_gopay: totalPembayaranGOPAY,
					pengeluaran_rekening: totalPembayaranREKENING,
					pengeluaran_cash: totalPembayaranCASH,
				};

				const data = {
					results,
					pengeluaran,
				};

				callback(null, data);
			}
		);
	},
	getPengeluaranByDate: (id, tanggal, callback) => {
		db.query(
			'SELECT pengeluaran_id, nama, DATE_FORMAT(tanggal, "%d %M %Y %H:%i:%s") AS tanggal, jumlah, pembayaran, user_id,  kategori FROM pengeluaran WHERE user_id = ? && tanggal BETWEEN ? AND ? ORDER BY pengeluaran_id DESC',
			[id, `${tanggal} 00:00:00`, `${tanggal} 23:59:59`],
			(error, results) => {
				if (error) {
					console.error(error);
					return callback(error, null);
				}

				let totalPembayaranGOPAY = 0;
				let totalPembayaranREKENING = 0;
				let totalPembayaranCASH = 0;

				let totalPengeluaranGOPAY = 0;
				let totalPengeluaranREKENING = 0;
				let totalPengeluaranCASH = 0;

				for (let i = 0; i < results.length; i++) {
					if (results[i].pembayaran === "GOPAY") {
						totalPembayaranGOPAY += results[i].jumlah;
						totalPengeluaranGOPAY++;
					}
					if (results[i].pembayaran === "REKENING") {
						totalPembayaranREKENING += results[i].jumlah;
						totalPengeluaranREKENING++;
					}
					if (results[i].pembayaran === "CASH") {
						totalPembayaranCASH += results[i].jumlah;
						totalPengeluaranCASH++;
					}
				}

				const pengeluaran = {
					pengeluaran_gopay: totalPembayaranGOPAY,
					pengeluaran_rekening: totalPembayaranREKENING,
					pengeluaran_cash: totalPembayaranCASH,
					pembelian_gopay: totalPengeluaranGOPAY,
					pembelian_rekening: totalPengeluaranREKENING,
					pembelian_cash: totalPengeluaranCASH,
					total:
						totalPengeluaranGOPAY + totalPengeluaranREKENING + totalPengeluaranCASH,
					total_pembelian:
						totalPembayaranCASH + totalPembayaranREKENING + totalPembayaranGOPAY,
					date: tanggal,
				};

				const data = {
					results,
					pengeluaran,
				};

				callback(null, data);
			}
		);
	},
	getPengeluaranByMonth: (id, bulan, tahun, callback) => {
		db.query(
			`SELECT pengeluaran_id, nama, DATE_FORMAT(tanggal, "%d %M %Y %H:%i:%s") AS tanggal, jumlah, pembayaran, user_id,  kategori FROM pengeluaran WHERE DATE_FORMAT(tanggal, '%Y-%m') = ? && user_id = ? ORDER BY pengeluaran_id DESC`,
			[`${tahun}-${bulan}`, id],
			(error, results) => {
				if (error) {
					console.error(error);
					return callback(error, null);
				}

				let totalPembayaranGOPAY = 0;
				let totalPembayaranREKENING = 0;
				let totalPembayaranCASH = 0;

				let totalPengeluaranGOPAY = 0;
				let totalPengeluaranREKENING = 0;
				let totalPengeluaranCASH = 0;

				for (let i = 0; i < results.length; i++) {
					if (results[i].pembayaran === "GOPAY") {
						totalPembayaranGOPAY += results[i].jumlah;
						totalPengeluaranGOPAY++;
					}
					if (results[i].pembayaran === "REKENING") {
						totalPembayaranREKENING += results[i].jumlah;
						totalPengeluaranREKENING++;
					}
					if (results[i].pembayaran === "CASH") {
						totalPembayaranCASH += results[i].jumlah;
						totalPengeluaranCASH++;
					}
				}

				const pengeluaran = {
					pengeluaran_gopay: totalPembayaranGOPAY,
					pengeluaran_rekening: totalPembayaranREKENING,
					pengeluaran_cash: totalPembayaranCASH,
					pembelian_gopay: totalPengeluaranGOPAY,
					pembelian_rekening: totalPengeluaranREKENING,
					pembelian_cash: totalPengeluaranCASH,
					total:
						totalPengeluaranGOPAY + totalPengeluaranREKENING + totalPengeluaranCASH,
					total_pembelian:
						totalPembayaranCASH + totalPembayaranREKENING + totalPembayaranGOPAY,
				};

				const data = {
					results,
					pengeluaran,
				};

				callback(null, data);
			}
		);
	},
	getPengeluaranChart: (id, callback) => {
		db.query(
			`SELECT DATE_FORMAT(tanggal, '%Y-%m-%d') AS tanggal, SUM(jumlah) AS jumlah FROM pengeluaran WHERE tanggal >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND user_id = ? GROUP BY DATE(tanggal) ORDER BY tanggal DESC`,
			[id],
			(error, results) => {
				if (error) {
					console.error(error);
					return callback(error, null);
				}

				const formattedResults = results.map((result) => result.tanggal);
				const formattedJumlah = results.map((result) => result.jumlah);

				const result = {
					tanggal: formattedResults,
					jumlah: formattedJumlah,
				};

				callback(null, result);
			}
		);
	},
	getPengeluaranByCategory: (user_id, kategori, callback) => {
		db.query(
			'SELECT pengeluaran_id, nama, DATE_FORMAT(tanggal, "%d %M %Y %H:%i:%s") AS tanggal, jumlah, pembayaran, user_id,  kategori FROM pengeluaran WHERE user_id = ? AND kategori = ? ORDER BY pengeluaran_id DESC',
			[user_id, kategori],
			(error, results) => {
				if (error) {
					return callback(error, null, 500);
				}

				let totalPembayaranGOPAY = 0;
				let totalPembayaranREKENING = 0;
				let totalPembayaranCASH = 0;

				for (let i = 0; i < results.length; i++) {
					if (results[i].pembayaran === "GOPAY") {
						totalPembayaranGOPAY += results[i].jumlah;
					}
					if (results[i].pembayaran === "REKENING") {
						totalPembayaranREKENING += results[i].jumlah;
					}
					if (results[i].pembayaran === "CASH") {
						totalPembayaranCASH += results[i].jumlah;
					}
				}

				const pengeluaran = {
					pengeluaran_gopay: totalPembayaranGOPAY,
					pengeluaran_rekening: totalPembayaranREKENING,
					pengeluaran_cash: totalPembayaranCASH,
				};

				const data = {
					results,
					pengeluaran,
				};

				callback(null, data);
			}
		);
	},
	getPengeluaranByDateCategory: (id, tanggal, kategori, callback) => {
		db.query(
			'SELECT pengeluaran_id, nama, DATE_FORMAT(tanggal, "%d %M %Y %H:%i:%s") AS tanggal, jumlah, pembayaran, user_id,  kategori FROM pengeluaran WHERE user_id = ? && tanggal BETWEEN ? AND ? && kategori = ? ORDER BY pengeluaran_id DESC',
			[id, `${tanggal} 00:00:00`, `${tanggal} 23:59:59`, kategori],
			(error, results) => {
				if (error) {
					return callback(error, null);
				}

				let totalPembayaranGOPAY = 0;
				let totalPembayaranREKENING = 0;
				let totalPembayaranCASH = 0;

				let totalPengeluaranGOPAY = 0;
				let totalPengeluaranREKENING = 0;
				let totalPengeluaranCASH = 0;

				for (let i = 0; i < results.length; i++) {
					if (results[i].pembayaran === "GOPAY") {
						totalPembayaranGOPAY += results[i].jumlah;
						totalPengeluaranGOPAY++;
					}
					if (results[i].pembayaran === "REKENING") {
						totalPembayaranREKENING += results[i].jumlah;
						totalPengeluaranREKENING++;
					}
					if (results[i].pembayaran === "CASH") {
						totalPembayaranCASH += results[i].jumlah;
						totalPengeluaranCASH++;
					}
				}

				const pengeluaran = {
					pengeluaran_gopay: totalPembayaranGOPAY,
					pengeluaran_rekening: totalPembayaranREKENING,
					pengeluaran_cash: totalPembayaranCASH,
					pembelian_gopay: totalPengeluaranGOPAY,
					pembelian_rekening: totalPengeluaranREKENING,
					pembelian_cash: totalPengeluaranCASH,
					total:
						totalPengeluaranGOPAY + totalPengeluaranREKENING + totalPengeluaranCASH,
					total_pembelian:
						totalPembayaranCASH + totalPembayaranREKENING + totalPembayaranGOPAY,
					date: tanggal,
				};

				const data = {
					results,
					pengeluaran,
				};

				callback(null, data);
			}
		);
	},
	getPengeluaranByMonthCategory: (id, bulan, tahun, kategori, callback) => {
		db.query(
			`SELECT pengeluaran_id, nama, DATE_FORMAT(tanggal, "%d %M %Y %H:%i:%s") AS tanggal, jumlah, pembayaran, user_id, kategori FROM pengeluaran WHERE DATE_FORMAT(tanggal, '%Y-%m') = ? && user_id = ? && kategori = ? ORDER BY pengeluaran_id DESC`,
			[`${tahun}-${bulan}`, id, kategori],
			(error, results) => {
				if (error) {
					console.error(error);
					return callback(error, null);
				}

				let totalPembayaranGOPAY = 0;
				let totalPembayaranREKENING = 0;
				let totalPembayaranCASH = 0;

				let totalPengeluaranGOPAY = 0;
				let totalPengeluaranREKENING = 0;
				let totalPengeluaranCASH = 0;

				for (let i = 0; i < results.length; i++) {
					if (results[i].pembayaran === "GOPAY") {
						totalPembayaranGOPAY += results[i].jumlah;
						totalPengeluaranGOPAY++;
					}
					if (results[i].pembayaran === "REKENING") {
						totalPembayaranREKENING += results[i].jumlah;
						totalPengeluaranREKENING++;
					}
					if (results[i].pembayaran === "CASH") {
						totalPembayaranCASH += results[i].jumlah;
						totalPengeluaranCASH++;
					}
				}

				const pengeluaran = {
					pengeluaran_gopay: totalPembayaranGOPAY,
					pengeluaran_rekening: totalPembayaranREKENING,
					pengeluaran_cash: totalPembayaranCASH,
					pembelian_gopay: totalPengeluaranGOPAY,
					pembelian_rekening: totalPengeluaranREKENING,
					pembelian_cash: totalPengeluaranCASH,
					total:
						totalPengeluaranGOPAY + totalPengeluaranREKENING + totalPengeluaranCASH,
					total_pembelian:
						totalPembayaranCASH + totalPembayaranREKENING + totalPembayaranGOPAY,
				};

				const data = {
					results,
					pengeluaran,
				};

				callback(null, data);
			}
		);
	},
};

module.exports = pengeluaranModel;
