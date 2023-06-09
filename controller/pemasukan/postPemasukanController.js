const pemasukanModel = require("../../models/pemasukan");

/**
 * @swagger
 * /api/pemasukan/{id}:
 *   post:
 *     summary: Melakukan Pemasukan Dana
 *     tags :
 *       - Pemasukan
 *     description: Melakukan Pemasukan Dana ke dalam database
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
 *                   example : Succes
 *                 message:
 *                   type: string
 *                   example: Berhasil memasukkan pemasukan
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 73
 *                     uang_gopay:
 *                       type: number
 *                       example: 20000
 *                     uang_cash:
 *                       type: number
 *                       example: 0
 *                     uang_rekening:
 *                       type: number
 *                       example: 0
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
 *                   message: Terjadi kesalahan pada input, mohon masukkan data yang benar!, Metode pembayaran tidak valid, mohon masukkan data seperti `GOPAY`, `CASH`, atau `REKENING`
 *               error2:
 *                 value:
 *                   status: Failed
 *                   message: Metode pembayaran tidak valid, mohon masukkan data seperti `GOPAY`, `CASH`, atau `REKENING`.
 *       401:
 *         description: Terjadi kesalahan input user_id
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
 *                   message: Akses ditolak, tidak dapat mengambil dengan user_id tersebut!
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
 *               message: Terjadi kesalahan pada server saat melakukan pemasukan.
 */
const pemasukan = (req, res) => {
  const { nama, tanggal, jumlah, pembayaran, user_id, kategori } = req.body;
  
  const id = req.params.id

  if(id.toString() !== req.body.user_id.toString()){
    return res.status(401).json({
      status: "Failed",
      message: "Akses ditolak, tidak dapat mengambil dengan user_id tersebut!"
    })
  }

  pemasukanModel.postPemasukan(nama, tanggal, jumlah, pembayaran, user_id, kategori.toLowerCase(), (error, result, statusCode) => {
    if(statusCode==400){
      return res.status(400).json({
        status: 'Failed',
        message: "Terjadi kesalahan pada input, mohon masukkan data yang benar!, Metode pembayaran tidak valid, mohon masukkan data seperti `GOPAY`, `CASH`, atau `REKENING`"
      });
    }
    
    if (error) {
      return res.status(500).json({
        status: 'Failed',
        message: "Terjadi kesalahan pada server saat melakukan pemasukan."
      });
    }
    

    return res.status(200).json({
      status: 'Success',
      message: "Berhasil memasukkan pemasukan",
      data: result,
    });
  });
};

module.exports = pemasukan;