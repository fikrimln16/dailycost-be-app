const pemasukanModel = require("../../models/pemasukan");

/**
 * @swagger
 * /api/pemasukan/{id}:
 *   delete:
 *     summary: Menghapus pemasukan by pemasukan_id
 *     description: Endpoint untuk Menghapus pemasukan by pemasukan_id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID pengguna
 *         required: true
 *         schema:
 *           type: integer
 *     tags:
 *       - Pemasukan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               pemasukan_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: pemasukan berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *             example:
 *               status: "Success"
 *               message: "Berhasil menghapus pemasukan!"
 *       401:
 *         description: Akses ditolak, tidak dapat mengambil dengan user_id tersebut!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               status: Failed
 *               message: "Akses ditolak, tidak dapat mengambil dengan user_id tersebut!"
 *       404:
 *         description: Pemasukan Tidak Ditemukan!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               status: Failed
 *               message: "Data Pemasukan Tidak Ditemukan!."
 *       500:
 *         description: Terjadi kesalahan saat menghapus pemasukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               status: Failed
 *               message: "Terjadi kesalahan."
 */
const deletePemasukan = (req, res) => {
	const { user_id, pemasukan_id } = req.body;
	const id = req.params.id

	if(id.toString() !== req.body.user_id.toString()){
    return res.status(401).json({
      status: "Failed",
      message: "Akses ditolak, tidak dapat mengambil dengan user_id tersebut!"
    })
  }
	
	pemasukanModel.dataPemasukanId(user_id, pemasukan_id, (error, result, statusCode) => {
		if (error) {
			return res.status(statusCode).json({
				status: "Failed",
				message: error,
			});
		}

    //jika tidak ada pemasukan_id return 404
		if (result.length === 0) {
			return res.status(404).json({
				status: "Failed",
				message: "Data pemasukan tidak ditemukan!",
			});
		}

		//mengambil data pemasukan dan jumlah terlebih dahulu
		var pembayaran = result[0].pembayaran;
		var jumlah = result[0].jumlah;

		//get saldo user
		pemasukanModel.getSaldo(user_id, (error, result, statusCode) => {
			let saldo_gopay = result[0].uang_gopay;
			let saldo_cash = result[0].uang_cash;
			let saldo_rekening = result[0].uang_rekening;

			//tambah saldo sesuai pembayaran yang ingin dihapus
			if (pembayaran === "GOPAY") {
				let saldo_gopay_new = saldo_gopay - jumlah;
				pemasukanModel.restoreSaldo(
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
				let saldo_cash_new = saldo_cash - jumlah;
				pemasukanModel.restoreSaldo(
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
				let saldo_rekening_new = saldo_rekening - jumlah;
				pemasukanModel.restoreSaldo(
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

      //delete pemasukan dari database
			pemasukanModel.deletePemasukan(
				user_id,
				pemasukan_id,
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


module.exports = deletePemasukan;
