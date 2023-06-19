const express = require("express");
const router = express.Router();
const verifyToken = require("../../auth/verifyToken");
const db = require("../../config/db");

/**
 * @swagger
 * /api/saldo/{id}:
 *   get:
 *     summary: Mengambil informasi saldo pengguna berdasarkan ID
 *     tags :
 *       - Saldo
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
 *         description: Berhasil mengambil informasi saldo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     uang_gopay:
 *                       type: number
 *                     uang_cash:
 *                       type: number
 *                     uang_rekening:
 *                       type: number
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan saat mengambil informasi saldo
 *     securityDefinitions:
 *       BearerAuth:
 *         type: apiKey
 *         name: Authorization
 *         in: header
 */
router.get("/saldo/:id", verifyToken, (req, res) => {
	const id = req.params.id;

	db.query(
		"SELECT uang_gopay, uang_cash, uang_rekening FROM tabungan WHERE id = ?",
		[id],
		(error, results) => {
			if (error) {
				console.error(error);
				return res.status(500).json({ message: "Terjadi kesalahan." });
			}

			if (results.length === 0) {
				return res.status(404).json({
					status: "Failed",
					message: "Data tidak ada!",
				});
			}

			return res.status(200).json({
				status: "Succes",
				data: results[0],
			});
		}
	);
});

module.exports = router;
