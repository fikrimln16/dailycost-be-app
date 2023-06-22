const catatanModel = require("../../models/catatan");

/**
 * @swagger
 * /api/catatan:
 *   put:
 *     summary: Mengubah title dan body catatan
 *     description: Endpoint untuk mengubah catatan
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Catatan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               catatan_id:
 *                 type: string
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       200:
 *         description: Catatan berhasil diedit
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
 *               message: "Catatan berhasil diperbarui"
 *               data:
 *                 catatan_id : 1
 *                 title : text title yang diubah
 *                 body : text body yang diubah
 *       404:
 *         description: Gagal membuat catatan karena validasi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               status: Failed
 *               message: "Catatan Tidak Ditemukan!"
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
 *               message: "Terjadi kesalahan pada server."
 */
const putCatatan = (req, res) => {
	const { user_id, catatan_id, title, body } = req.body;

	catatanModel.updateCatatan(
		catatan_id,
		user_id,
		title,
		body,
		(error, result, statusCode) => {
			if (error) {
				return res.status(statusCode).json({
					status: "Failed",
					message: error,
				});
			}

			return res.status(statusCode).json({
				status: "Success",
				message: "Catatan berhasil diperbarui",
				data: result,
			});
		}
	);
};

module.exports = putCatatan;
