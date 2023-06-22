const pengeluaranModel = require("../../models/pengeluaran");

const deletePengeluaran = (req, res) => {
	const { user_id, pengeluaran_id } = req.body;

	pengeluaranModel.dataPengeluaran(user_id, pengeluaran_id, (error, result, statusCode) => {
		if (error) {
			return res.status(statusCode).json({
				status: "Failed",
				message: error,
			});
		}

    //jika tidak ada pengeluaran_id return 404
		if (result.length === 0) {
			return res.status(404).json({
				status: "Failed",
				message: "Data pengeluaran tidak ditemukan!",
			});
		}

		//mengambil data pembayaran dan jumlah terlebih dahulu
		var pembayaran = result[0].pembayaran;
		var jumlah = result[0].jumlah;

		//get saldo user
		pengeluaranModel.getSaldo(user_id, (error, result, statusCode) => {
			let saldo_gopay = result[0].uang_gopay;
			let saldo_cash = result[0].uang_cash;
			let saldo_rekening = result[0].uang_rekening;

			//tambah saldo sesuai pembayaran yang ingin dihapus
			if (pembayaran === "GOPAY") {
				let saldo_gopay_new = saldo_gopay + jumlah;
				pengeluaranModel.restoreSaldo(
					user_id,
					saldo_gopay_new,
					saldo_cash,
					saldo_rekening,
					(error, result) => {
						if (error) {
							return res.status(statusCode).json({
								status: "Failed",
								message: error,
							});
						}
					}
				);
			}
			if (pembayaran === "CASH") {
				let saldo_cash_new = saldo_cash + jumlah;
				pengeluaranModel.restoreSaldo(
					user_id,
					saldo_gopay,
					saldo_cash_new,
					saldo_rekening,
					(error, result) => {
						if (error) {
							return res.status(statusCode).json({
								status: "Failed",
								message: error,
							});
						}
					}
				);
			}
			if (pembayaran === "REKENING") {
				let saldo_rekening_new = saldo_rekening + jumlah;
				pengeluaranModel.restoreSaldo(
					user_id,
					saldo_gopay,
					saldo_cash,
					saldo_rekening_new, 
					(error, result, statusCode) => {
						if (error) {
							return res.status(statusCode).json({
								status: "Failed",
								message: error,
							});
						}
					}
				);
			}

      //delete pengeluaran dari database
			pengeluaranModel.deletePengeluaran(
				user_id,
				pengeluaran_id,
				(error, result, statusCode) => {
					if (error) {
						return res.status(statusCode).json({
							status: "Failed",
							message: error,
						});
					}
					return res.status(statusCode).json({
						status: "Success",
						message: result
					});
				}
			);
		});
	});
};


module.exports = deletePengeluaran;
