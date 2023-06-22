const pengeluaranModel = require("../../models/pengeluaran");

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
const getPengeluaranByDate = (req, res) => {
  const id = req.params.id;
  const tanggal = req.params.tanggal;

  pengeluaranModel.getPengeluaranByDate(id, tanggal, (error, data) => {
    if (error) {
      console.error(error);
      return res.status(500).json({
        status: 'Failed',
        message: 'Terjadi kesalahan pada server!',
      });
    }

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil mengambil data pada tanggal: ${tanggal}`,
      data,
    });
  });
}

module.exports = getPengeluaranByDate