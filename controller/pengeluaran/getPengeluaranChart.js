const pengeluaranModel = require("../../models/pengeluaran");

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
 *         description: Terjadi kesalahan saat mengambil data chart pengeluaran
 */
const getPengeluaranChart = (req, res) => {
  const id = req.params.id;

  pengeluaranModel.getPengeluaranChart(id, (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({
        status: 'Failed',
        message: 'Terjadi kesalahan pada server!',
      });
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mengambil chart',
      data: result,
    });
  });
}

module.exports = getPengeluaranChart