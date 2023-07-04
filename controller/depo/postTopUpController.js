const depoModel = require('../../models/depo');

/**
 * @swagger
 * /api/topup/{id}:
 *   post:
 *     summary: Menambahkan saldo depo pengguna
 *     tags:
 *       - Depo
 *     description: Endpoint untuk menambahkan saldo depo pengguna
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
 *               id:
 *                 type: integer
 *                 example: 73
 *               uang_gopay:
 *                 type: number
 *                 example: 20000
 *               uang_cash:
 *                 type: number
 *                 example: 30000
 *               uang_rekening:
 *                 type: number
 *                 example: 50000
 *             required:
 *               - id
 *               - uang_gopay
 *               - uang_cash
 *               - uang_rekening
 *     responses:
 *       200:
 *         description: Berhasil mengubah saldo depo
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
 *                     user_id:
 *                       type: integer
 *                     uang_gopay:
 *                       type: number
 *                     uang_cash:
 *                       type: number
 *                     uang_rekening:
 *                       type: number
 *             example:
 *               status: "Success"
 *               message: "Berhasil topup saldo, saldo baru dengan user id : 73 adalah"
 *               data:
 *                 user_id: 73
 *                 uang_gopay: 50000
 *                 uang_cash: 80000
 *                 uang_rekening: 100000
 *       401:
 *         description: Tidak ada user_id yang dimaksud
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
 *               status: "Failed"
 *               message: Akses ditolak, tidak dapat mengambil dengan user_id tersebut!
 *       500:
 *         description: Terjadi kesalahan saat mengubah saldo depo
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
 *               status: "Failed"
 *               message: "Terjadi kesalahan pada server."
 */
const topup = (req, res) => {
  const { id, uang_gopay, uang_cash, uang_rekening } = req.body;

  const user_id = req.params.id

  if(user_id.toString() !== req.body.id.toString()){
    return res.status(401).json({
      status: "Failed",
      message: "Akses ditolak, tidak dapat mengambil dengan user_id tersebut!"
    })
  }

  depoModel.topUp(id, uang_gopay, uang_cash, uang_rekening, (error, saldoUser, statusCode) => {
    
    if(statusCode===401){
      return res.status(statusCode).json({
        status: 'Failed',
        message: error,
      });
    }
    if (error) {
      return res.status(statusCode).json({
        status: 'Failed',
        message: 'Terjadi kesalahan pada server!',
      });
    }

    return res.status(statusCode).json({
      status: 'Success',
      message: `Berhasil topup saldo, saldo baru dengan user id : ${id} adalah`,
      data: saldoUser,
    });
  });
};

module.exports = topup;
