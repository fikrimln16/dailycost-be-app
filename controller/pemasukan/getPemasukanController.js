const pemasukanModel = require("../../models/pemasukan")

/**
 * @swagger
 * /api/pemasukan/{id}:
 *   get:
 *     summary: Mengambil daftar pemasukan berdasarkan ID pengguna
 *     tags:
 *       - Pemasukan
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
 *         description: Berhasil mengambil daftar pemasukan
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
 *                   example: Berhasil input pemasukan dengan user id 1
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       pemasukan_id:
 *                         type: integer
 *                         example: 1
 *                       nama:
 *                         type: string
 *                         example: Gajian dari bos bulan ini
 *                       tanggal:
 *                         type: string
 *                         example: 2023-04-05
 *                       jumlah:
 *                         type: number
 *                         example: 200000
 *                       pembayaran:
 *                         type: string
 *                         example: REKENING
 *                       kategori:
 *                         type: string
 *                         example: Salary
 *       500:
 *         description: Terjadi kesalahan saat mengambil daftar pemasukan
 */
const getPemasukanController = (req, res) => {
  const id = req.params.id;
  pemasukanModel.dataPemasukan(id, (error, result) =>{
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Terjadi kesalahan.' });
    }

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil mengambil pemasukan dengan user id: ${id}`,
      data: result,
    });
  })
}

module.exports = getPemasukanController