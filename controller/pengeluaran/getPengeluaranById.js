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

const getPengeluaranById = (req, res) => {
  const id = req.params.id;
  const kategori = req.query.kategori;

  if (kategori) {
    // Jika query kategori ada
    pengeluaranModel.getPengeluaranByCategory(id, kategori.toLowerCase(), (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan.' });
      }

      return res.status(200).json({
        status: 'Success',
        message: `Berhasil mengambil pengeluaran dengan user id: ${id} dan kategori: ${kategori}`,
        data: result,
      });
    });
  } else {
    // Jika query kategori tidak ada
    pengeluaranModel.getPengeluaranById(id, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan.' });
      }

      return res.status(200).json({
        status: 'Success',
        message: `Berhasil mengambil pengeluaran dengan user id: ${id}`,
        data: result,
      });
    });
  }
};


module.exports = getPengeluaranById