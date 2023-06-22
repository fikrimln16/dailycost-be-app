const catatanModel = require("../../models/catatan");

/**
 * @swagger
 * /api/catatan:
 *   get:
 *     summary: Mendapatkan daftar catatan
 *     tags:
 *       - Catatan
 *     description: Endpoint untuk mendapatkan daftar catatan
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar catatan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       body:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date
 *                       user_id:
 *                         type: integer
 *                       image_url:
 *                         type: string
 *             example:
 *               status: "Success"
 *               message: "Berhasil Mengambil Catatan!"
 *               data:
 *                 - id: 1
 *                   title: "Catatan Penting"
 *                   body: "Ini adalah catatan penting"
 *                   date: "2023-06-16"
 *                   user_id: 73
 *                   image_url: "https://storage.googleapis.com/dailycost-catatan-images/1623839930341-gambar.jpg"
 *                 - id: 2
 *                   title: "Catatan Harian"
 *                   body: "Ini adalah catatan harian"
 *                   date: "2023-06-17"
 *                   user_id: 73
 *                   image_url: "https://storage.googleapis.com/dailycost-catatan-images/1623840051892-gambar.jpg"
 *       500:
 *         description: Terjadi kesalahan saat mendapatkan daftar catatan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               status: "Failed"
 *               message: "Terjadi kesalahan."
 */
const getCatatan = (req, res) => {
	catatanModel.getCatatan((error, results, statusCode) => {
		if (error) {
			return res
				.status(statusCode)
				.json({ status: "Failed", message: "Terjadi kesalahan." });
		}
		if (results.length === 0) {
			return res
				.status(statusCode)
				.json({ status: "Failed", message: "Data tidak ada!", data: [] });
		}
		return res.status(statusCode).json({
			status: "Success",
			message: "Berhasil Mengambil Catatan!",
			data: results,
		});
	});
};

module.exports = getCatatan;
