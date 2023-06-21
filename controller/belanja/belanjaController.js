// belanjaController.js
const db = require("../../config/db"); // Impor file database.js

const belanja = (req, res) => {
	const { nama, tanggal, jumlah, pembayaran, user_id, kategori } = req.body;
	if (
		pembayaran == "GOPAY" ||
		pembayaran == "CASH" ||
		pembayaran == "REKENING"
	) {
		try {
			db.query(
				"INSERT INTO pengeluaran VALUES(null, ?, ?, ?, ?, ?) ",
				[nama, tanggal, jumlah, pembayaran, user_id],
				(error, results) => {
					if (error) {
						console.error(error);
						return res.status(400).json({
							status: "Failed",
							message: "Terjadi kesalahan pada input, mohon masukkan data yang benar!",
						});
					}

					db.query(
						`SELECT uang_gopay, uang_cash, uang_rekening FROM tabungan WHERE id = ${user_id}`,
						(error, results) => {
							if (error) {
								console.error(error);
								return res.status(400).json({
									status: "Failed",
									message: "Terjadi kesalahan input, mohon masukkan data yang benar!",
								});
							}

							const uang_gopay = results[0].uang_gopay;
							const uang_cash = results[0].uang_cash;
							const uang_rekening = results[0].uang_rekening;

							if (pembayaran == "GOPAY") {
								const uang_gopay_update = uang_gopay - jumlah;
								db.query(
									`UPDATE tabungan SET uang_gopay = ${uang_gopay_update} WHERE id = ${user_id}`,
									(error, results) => {
										if (error) {
											console.error(error);
											return res.status(500).json({
												status: "Failed",
												message:
													"Terjadi kesalahan pada server saat melakukan pembelanjaan.",
											});
										}
										return res.status(200).json({
											status: "Success",
											message: "Berhasil Membeli Barang!",
											data: req.body,
										});
									}
								);
							} else if (pembayaran == "REKENING") {
								const uang_rekening_update = uang_rekening - jumlah;
								db.query(
									`UPDATE tabungan SET uang_rekening = ${uang_rekening_update} WHERE id = ${user_id}`,
									(error, results) => {
										if (error) {
											console.error(error);
											return res.status(500).json({
												status: "Failed",
												message:
													"Terjadi kesalahan pada server saat melakukan pembelanjaan.",
											});
										}

										return res.status(200).json({
											status: "Success",
											message: "Berhasil Membeli Barang!",
											data: req.body,
										});
									}
								);
							} else if (pembayaran == "CASH") {
								const uang_cash_update = uang_cash - jumlah;
								db.query(
									`UPDATE tabungan SET uang_cash = ${uang_cash_update} WHERE id = ${user_id}`,
									(error, results) => {
										if (error) {
											console.error(error);
											return res.status(500).json({
												status: "Failed",
												message:
													"Terjadi kesalahan pada server saat melakukan pembelanjaan.",
											});
										}

										return res.status(200).json({
											status: "Success",
											message: "Berhasil Membeli Barang!",
											data: req.body,
										});
									}
								);
							}
						}
					);
				}
			);
		} catch (error) {
			console.error(error);
			return res.status(500).json({
				status: "Failed",
				message: "Terjadi kesalahan pada server saat melakukan pembelanjaan.",
			});
		}
	} else {
		return res.status(400).json({
			status: "Failed",
			message:
				"Metode pembayaran tidak valid, mohon masukkan data seperti `GOPAY`, `CASH`, atau `REKENING`.",
		});
	}
};

module.exports = belanja;
