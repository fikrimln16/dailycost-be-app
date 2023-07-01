const pengeluaranModel = require("../../models/pengeluaran");


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
 *                   example: Berhasil mengambil pengeluaran dengan user id 1 pada bulan 04 tahun 2023 dan kategori makanan
 *                 data:
 *                   type: object
 *                   properties:
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           pengeluaran_id:
 *                             type: integer
 *                             example: 1
 *                           nama:
 *                             type: string
 *                             example: Makanan Ketoprak
 *                           tanggal:
 *                             type: string
 *                             example: 2023-04-05
 *                           jumlah:
 *                             type: number
 *                             example: 30000
 *                           pembayaran:
 *                             type: string
 *                             example: GOPAY
 *                           user_id:
 *                             type: integer
 *                             example: 1
 *                           kategori:
 *                             type: string
 *                             example: makanan
 *                     pengeluaran:
 *                       type: object
 *                       properties:
 *                         pengeluaran_gopay:
 *                           type: number
 *                           example: 30000
 *                         pengeluaran_rekening:
 *                           type: number
 *                           example: 0
 *                         pengeluaran_cash:
 *                           type: number
 *                           example: 0
 *                         pembelian_gopay:
 *                           type: number
 *                           example: 1
 *                         pembelian_rekening:
 *                           type: number
 *                           example: 0
 *                         pembelian_cash:
 *                           type: number
 *                           example: 0
 *                         total:
 *                           type: number
 *                           example: 1
 *                         total_pembelian:
 *                           type: number
 *                           example: 30000
 *                         date:
 *                           type: string
 *                           example: 2023-04-05
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
const getPengeluaranByMonth = (req, res) => {
  const id = req.params.id;
  const bulan = req.params.bulan;
  const tahun = req.params.tahun;
  const kategori = req.query.kategori;

  if(kategori){
    pengeluaranModel.getPengeluaranByMonthCategory(
      id,
      bulan,
      tahun,
      kategori.toLowerCase(),
      (error, data) => {
        if (error) {
          console.error(error);
          return res.status(500).json({
            status: 'Failed',
            message: 'Terjadi kesalahan pada server saat mengambil data pengeluaran.',
          });
        }
  
        return res.status(200).json({
          status: 'Success',
          message: `Berhasil mengambil pengeluaran dengan user id ${id} pada bulan ${bulan} tahun ${tahun} dan kategori ${kategori}`,
          data,
        });
      }
    );
  } else {
    pengeluaranModel.getPengeluaranByMonth(
      id,
      bulan,
      tahun,
      (error, data) => {
        if (error) {
          console.error(error);
          return res.status(500).json({
            status: 'Failed',
            message: 'Terjadi kesalahan pada server saat mengambil data pengeluaran.',
          });
        }
  
        return res.status(200).json({
          status: 'Success',
          message: `Berhasil mengambil pengeluaran dengan user id ${id} pada bulan ${bulan} tahun ${tahun}`,
          data,
        });
      }
    );
  }
}

module.exports = getPengeluaranByMonth