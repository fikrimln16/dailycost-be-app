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
 *                   example: Succes
 *                 message:
 *                   type: string
 *                   example: Berhasil mengambil pengeluaran dengan user id 1 dan kategori makanan
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       pengeluaran_id:
 *                         type: integer
 *                         example: 1
 *                       nama:
 *                         type: string
 *                         example: Makanan Kucing
 *                       tanggal:
 *                         type: string
 *                         example: 22 June 2023 14:43:59
 *                       jumlah:
 *                         type: number
 *                         example: 20000
 *                       pembayaran:
 *                         type: string
 *                         example: GOPAY
 *                       user_id:
 *                         type: integer
 *                         example: 1
 *                       kategori:
 *                         type: string
 *                         example: makanan
 *                 pengeluaran:
 *                   type: object
 *                   properties:
 *                     pengeluaran_gopay:
 *                       type: number
 *                       example: 20000
 *                     pengeluaran_rekening:
 *                       type: number
 *                       example: 0
 *                     pengeluaran_cash:
 *                       type: number
 *                       example: 0
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
