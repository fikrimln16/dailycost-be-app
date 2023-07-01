const pengeluaranModel = require("../../models/pengeluaran");

/**
 * @swagger
 * /api/pengeluaran/{id}:
 *   get:
 *     summary: Mengambil daftar pengeluaran berdasarkan ID pengguna
 *     tags:
 *       - Pengeluaran
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID pengguna
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: kategori
 *         description: Filter pengeluaran berdasarkan kategori
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar pengeluaran
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: Berhasil mengambil pengeluaran dengan user id 73 dan kategori hiburan
 *                 data:
 *                   type: object
 *                   properties:
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           pengeluaran_id:
 *                             type: integer
 *                             example: 139
 *                           nama:
 *                             type: string
 *                             example: Dufan
 *                           tanggal:
 *                             type: string
 *                             example: 24 April 2023 00:00:00
 *                           jumlah:
 *                             type: number
 *                             example: 20000
 *                           pembayaran:
 *                             type: string
 *                             example: REKENING
 *                           user_id:
 *                             type: integer
 *                             example: 73
 *                           kategori:
 *                             type: string
 *                             example: hiburan
 *                     pengeluaran:
 *                       type: object
 *                       properties:
 *                         pengeluaran_gopay:
 *                           type: number
 *                           example: 60000
 *                         pengeluaran_rekening:
 *                           type: number
 *                           example: 20000
 *                         pengeluaran_cash:
 *                           type: number
 *                           example: 0
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
 *       500:
 *         description: Terjadi kesalahan pada server saat melakukan pembelanjaan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               status: Failed
 *               message: Terjadi kesalahan pada server saat mengambil data pengeluaran.
 */

const getPengeluaranById = (req, res) => {
	const id = req.params.id;
	const kategori = req.query.kategori;

	if (kategori) {
		// Jika query kategori ada
		pengeluaranModel.getPengeluaranByCategory(
			id,
			kategori.toLowerCase(),
			(error, result) => {
				if (error) {
					console.error(error);
					return res.status(500).json({
						status: "Failed",
						message: "Terjadi kesalahan.",
					});
				}

				return res.status(200).json({
					status: "Success",
					message: `Berhasil mengambil pengeluaran dengan user id: ${id} dan kategori: ${kategori}`,
					data: result,
				});
			}
		);
	} else {
		// Jika query kategori tidak ada
		pengeluaranModel.getPengeluaranById(id, (error, result) => {
			if (error) {
				console.error(error);
				return res
					.status(500)
					.json({ status: "Failed", message: "Terjadi kesalahan." });
			}

			return res.status(200).json({
				status: "Success",
				message: `Berhasil mengambil pengeluaran dengan user id: ${id}`,
				data: result,
			});
		});
	}
};

module.exports = getPengeluaranById;
