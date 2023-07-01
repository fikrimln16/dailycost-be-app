const pengeluaranModel = require("../../models/pengeluaran");

/**
 * @swagger
 * /api/pengeluaran/{id}:
 *   post:
 *     summary: Melakukan input pengeluaran barang
 *     tags :
 *       - Pengeluaran
 *     description: Menginputkan informasi pengeluaran barang ke dalam database
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID pengguna
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 example: Makanan
 *               tanggal:
 *                 type: string
 *                 format: date
 *                 example: 2023-04-05
 *               jumlah:
 *                 type: number
 *                 example: 20000
 *               pembayaran:
 *                 type: string
 *                 example: GOPAY
 *               user_id:
 *                 type: integer
 *                 example: 73
 *               kategori:
 *                 type: string
 *                 example: Makanan
 *     responses:
 *       200:
 *         description: Berhasil melakukan pembelian
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
 *                   properties:
 *                     nama:
 *                       type: string
 *                     tanggal:
 *                       type: string
 *                       format: date
 *                     jumlah:
 *                       type: number
 *                     pembayaran:
 *                       type: string
 *                     user_id:
 *                       type: number
 *                     kategori:
 *                       type: string
 *       400:
 *         description: Terjadi kesalahan input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             examples:
 *               error1:
 *                 value:
 *                   status: Failed
 *                   message: Terjadi kesalahan pada input, mohon masukkan data yang benar!
 *               error2:
 *                 value:
 *                   status: Failed
 *                   message: Metode pembayaran tidak valid, mohon masukkan data seperti `GOPAY`, `CASH`, atau `REKENING`.
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
 *               message: Terjadi kesalahan pada server saat melakukan pembelanjaan.
 */
const postPengeluaran = (req, res) => {
  const { nama, tanggal, jumlah, pembayaran, user_id, kategori } = req.body;
  const id = req.params.id

  if(id.toString() !== req.body.user_id.toString()){
    return res.status(401).json({
      message: "Akses ditolak, tidak dapat mengambil dengan user_id tersebut!"
    })
  }

  pengeluaranModel.postPengeluaran(nama, tanggal, jumlah, pembayaran, user_id, kategori.toLowerCase(), (error, message, statusCode) => {
    if(statusCode==400){
      return res.status(statusCode).json({
        status: 'Failed',
        message: message,
      });
    }
    
    if (error) {
      return res.status(500).json({
        status: 'Failed',
        message: error,
      });
    }
    

    return res.status(200).json({
      status: 'Success',
      message: message,
      data: req.body,
    });
  });
};

module.exports = postPengeluaran;
