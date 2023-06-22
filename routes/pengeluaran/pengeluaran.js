const express = require("express");
const router = express.Router();
const verifyToken = require("../../auth/verifyToken");
const db = require("../../config/db");

const deletePengeluaran = require("../../controller/pengeluaran/deletePengeluaran")

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
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar pengeluaran
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       pengeluaran_id:
 *                         type: integer
 *                       nama:
 *                         type: string
 *                       tanggal:
 *                         type: string
 *                       jumlah:
 *                         type: number
 *                       pembayaran:
 *                         type: string
 *                 pengeluaran:
 *                   type: object
 *                   properties:
 *                     pengeluaran_gopay:
 *                       type: number
 *                     pengeluaran_rekening:
 *                       type: number
 *                     pengeluaran_cash:
 *                       type: number
 *       500:
 *         description: Terjadi kesalahan saat mengambil daftar pengeluaran
 */
router.get("/pengeluaran/:id", verifyToken, (req, res) => {
	const id = req.params.id;

	db.query(
		'SELECT pengeluaran_id, nama, DATE_FORMAT(tanggal, "%d %M %Y %H:%i:%s") AS tanggal, jumlah, pembayaran FROM pengeluaran WHERE user_id = ? ORDER BY pengeluaran_id DESC ',
		[id],
		(error, results) => {
			if (error) {
				console.error(error);
				return res.status(500).json({
					status: "Failed",
					message: `Terjadi kesalahan pada server!`,
				});
			}

			// if (results.length === 0) {
			// 	return res.status(401).json({
			// 		status: "Failed",
			// 		message: "Data Tidak ada",
			// 	});
			// }

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

			return res.status(200).json({
				status: "Succes",
				message: `Berhasil mengambil pengeluaran dengan user id : ${id}`,
				data: { results, pengeluaran },
			});
		}
	);
});

/**
 * @swagger
 * /api/pengeluaran/chart/{id}:
 *   get:
 *     summary: Mengambil data chart pengeluaran berdasarkan ID pengguna
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
 *     responses:
 *       200:
 *         description: Berhasil mengambil data chart pengeluaran
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: object
 *                   properties:
 *                     tanggal:
 *                       type: array
 *                       items:
 *                         type: string
 *                     jumlah:
 *                       type: array
 *                       items:
 *                         type: number
 *       500:
 *         description: Terjadi kesalahan saat mengambil data chart pengeluaran
 */
router.get("/pengeluaran/chart/:id", verifyToken, (req, res) => {
	const id = req.params.id;

	db.query(
		`SELECT DATE_FORMAT(tanggal, '%Y-%m-%d') AS tanggal, SUM(jumlah) AS jumlah FROM pengeluaran WHERE tanggal >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND user_id = ${id} GROUP BY DATE(tanggal) ORDER BY "tanggal" DESC`,
		(error, results) => {
			if (error) {
				console.error(error);
				return res.status(500).json({
					status: "Failed",
					message: `Terjadi kesalahan pada server!`,
				});
			}

			// if (results.length === 0) {
			// 	return res.status(401).json({
			// 		status: "Failed",
			// 		message: `Data tidak ada!`,
			// 	});
			// }

			const formattedResults = results.map((result) => result.tanggal);
			const formattedJumlah = results.map((result) => result.jumlah);

			const result = {
				tanggal: formattedResults,
				jumlah: formattedJumlah,
			};

			return res.status(200).json({
				status: "Succes",
				message: "Berhasil mengambil chart",
				data: result,
			});
		}
	);
});

/**
 * @swagger
 * /api/pengeluaran/{id}/list/{bulan}/{tahun}:
 *   get:
 *     summary: Mengambil daftar pengeluaran berdasarkan ID pengguna, bulan, dan tahun
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
 *       - in: path
 *         name: bulan
 *         description: Bulan (format MM)
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: tahun
 *         description: Tahun (format YYYY)
 *         required: true
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
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nama:
 *                         type: string
 *                       tanggal:
 *                         type: string
 *                       jumlah:
 *                         type: number
 *                       pembayaran:
 *                         type: string
 *                 pengeluaran:
 *                   type: object
 *                   properties:
 *                     pengeluaran_gopay:
 *                       type: number
 *                     pengeluaran_rekening:
 *                       type: number
 *                     pengeluaran_cash:
 *                       type: number
 *                     pembelian_gopay:
 *                       type: number
 *                     pembelian_rekening:
 *                       type: number
 *                     pembelian_cash:
 *                       type: number
 *                     total:
 *                       type: number
 *                     total_pembelian:
 *                       type: number
 *       500:
 *         description: Terjadi kesalahan saat mengambil daftar pengeluaran
 */
router.get("/pengeluaran/:id/list/:bulan/:tahun", verifyToken, (req, res) => {
	const id = req.params.id;
	const bulan = req.params.bulan;
	const tahun = req.params.tahun;
	db.query(
		`SELECT nama, DATE_FORMAT(tanggal, "%d %M %Y %H:%i:%s") AS tanggal, jumlah, pembayaran FROM pengeluaran WHERE DATE_FORMAT(tanggal, '%Y-%m') = '${tahun}-${bulan}' && user_id = ${id}`,
		(error, results) => {
			if (error) {
				console.error(error);
				return res.status(500).json({
					status: "Failed",
					message: `Terjadi kesalahan pada server!`,
				});
			}
			// if (results.length === 0) {
			//   return res.status(401).json({ message: 'Data Tidak ada', print: tanggal });
			// }
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

			return res.status(200).json({
				status: "Succes",
				message: `Berhasil menggal data pada bulan: ${bulan}, tahun: ${tahun} `,
				data: { results, pengeluaran },
			});
		}
	);
});

/**
 * @swagger
 * /api/pengeluaran/{id}/list/{tanggal}:
 *   get:
 *     summary: Mengambil daftar pengeluaran berdasarkan ID pengguna dan tanggal
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
 *       - in: path
 *         name: tanggal
 *         description: Tanggal (format YYYY-MM-DD)
 *         required: true
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
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nama:
 *                         type: string
 *                       tanggal:
 *                         type: string
 *                       jumlah:
 *                         type: number
 *                       pembayaran:
 *                         type: string
 *                 pengeluaran:
 *                   type: object
 *                   properties:
 *                     pengeluaran_gopay:
 *                       type: number
 *                     pengeluaran_rekening:
 *                       type: number
 *                     pengeluaran_cash:
 *                       type: number
 *                     pembelian_gopay:
 *                       type: number
 *                     pembelian_rekening:
 *                       type: number
 *                     pembelian_cash:
 *                       type: number
 *                     total:
 *                       type: number
 *                     total_pembelian:
 *                       type: number
 *                     date:
 *                       type: string
 *       500:
 *         description: Terjadi kesalahan saat mengambil daftar pengeluaran
 */
router.get("/pengeluaran/:id/list/:tanggal", verifyToken, (req, res) => {
	const id = req.params.id;
	const tanggal = req.params.tanggal;
	db.query(
		`SELECT nama, DATE_FORMAT(tanggal, "%d %M %Y %H:%i:%s") AS tanggal, jumlah, pembayaran FROM pengeluaran WHERE user_id = ${id} && tanggal BETWEEN "${tanggal} 00:00:00" AND "${tanggal} 23:59:59"`,
		(error, results) => {
			if (error) {
				console.error(error);
				return res.status(500).json({
					status: "Failed",
					message: `Terjadi kesalahan pada server!`,
				});
			}
			// if (results.length === 0) {
			//   return res.status(401).json({ message: 'Data Tidak ada', print: tanggal });
			// }

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

			return res.status(200).json({
				status: "Succes",
				message: `Berhasil menggal data pada tanggal : ${tanggal} `,
				data: { results, pengeluaran },
			});
		}
	);
});


/**
 * @swagger
 * /api/pengeluaran:
 *   delete:
 *     summary: Menghapus pengeluaran by pengeluaran_id
 *     description: Endpoint untuk Menghapus pengeluaran by pengeluaran_id
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Pengeluaran
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               pengeluaran_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Catatan berhasil dibuat
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
 *               message: "Berhasil menghapus catatan!"
 *       404:
 *         description: Catatan Tidak Ditemukan!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               status: Failed
 *               message: "Catatan Tidak Ditemukan!."
 *       500:
 *         description: Terjadi kesalahan saat membuat catatan
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
router.delete("/pengeluaran", deletePengeluaran)

module.exports = router;
