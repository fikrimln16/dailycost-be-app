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
 *                   example: Berhasil mengambil pengeluaran dengan user id 1 pada tanggal 2023-04-05 dan kategori makanan
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
 *                         example: Makanan Ketoprak
 *                       tanggal:
 *                         type: string
 *                         example: 2023-04-05
 *                       jumlah:
 *                         type: number
 *                         example: 30000
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
 *                       example: 30000
 *                     pengeluaran_rekening:
 *                       type: number
 *                       example: 0
 *                     pengeluaran_cash:
 *                       type: number
 *                       example: 0
 *                     pembelian_gopay:
 *                       type: number
 *                       example: 1
 *                     pembelian_rekening:
 *                       type: number
 *                       example: 0
 *                     pembelian_cash:
 *                       type: number
 *                       example: 0
 *                     total:
 *                       type: number
 *                       example: 1
 *                     total_pembelian:
 *                       type: number
 *                       example: 30000
 *                     date:
 *                       type: string
 *                       example: 2023-04-05
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
const getPengeluaranByDate = (req, res) => {
  const id = req.params.id;
  const tanggal = req.params.tanggal;
  const kategori = req.query.kategori;

  if(kategori){
    pengeluaranModel.getPengeluaranByDateCategory(id, tanggal, kategori.toLowerCase(), (error, data) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          status: 'Failed',
          message: 'Terjadi kesalahan pada server!',
        });
      }
  
      return res.status(200).json({
        status: 'Success',
        message: `Berhasil mengambil pengeluaran dengan user id ${id} pada tanggal ${tanggal} dan kategori ${kategori}`,
        data,
      });
    });
  }else{
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
        message: `Berhasil mengambil pengeluaran dengan user id ${id} pada tanggal ${tanggal} dan kategori ${kategori}`,
        data,
      });
    });

  }
}

module.exports = getPengeluaranByDate