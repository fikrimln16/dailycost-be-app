const depoModel = require('../../models/depo');


// /**
//  * @swagger
//  * /api/depo:
//  *   post:
//  *     summary: Menambahkan depo pada user baru
//  *     tags:
//  *       - Depo
//  *     description: Endpoint untuk Menambahkan depo pada user baru
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               id:
//  *                 type: integer
//  *                 example: 73
//  *               uang_gopay:
//  *                 type: number
//  *                 example: 20000
//  *               uang_cash:
//  *                 type: number
//  *                 example: 30000
//  *               uang_rekening:
//  *                 type: number
//  *                 example: 50000
//  *             required:
//  *               - id
//  *               - uang_gopay
//  *               - uang_cash
//  *               - uang_rekening
//  *     responses:
//  *       200:
//  *         description: Berhasil mengubah saldo depo
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                 message:
//  *                   type: string
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     user_id:
//  *                       type: integer
//  *                     uang_gopay:
//  *                       type: number
//  *                     uang_cash:
//  *                       type: number
//  *                     uang_rekening:
//  *                       type: number
//  *             example:
//  *               status: "Success"
//  *               message: "Berhasil menambahkan saldo baru dengan user id: 73"
//  *               data:
//  *                 user_id: 73
//  *                 uang_gopay: 20000
//  *                 uang_cash: 30000
//  *                 uang_rekening: 50000
//  *       401:
//  *         description: Tidak ada user_id yang dimaksud
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                 message:
//  *                   type: string
//  *             example:
//  *               status: "Failed"
//  *               message: "Mohon masukkan data user_id yang benar"
//  *       500:
//  *         description: Terjadi kesalahan saat mengubah saldo depo
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                 message:
//  *                   type: string
//  *             example:
//  *               status: "Failed"
//  *               message: "Terjadi kesalahan pada server."
//  */
const depo = (req, res) => {
  const { id, uang_gopay, uang_cash, uang_rekening } = req.body;

  depoModel.newDepo(id, uang_gopay, uang_cash, uang_rekening, (error, saldoUser) => {
    if (error) {
      console.error(error);
      return res.status(500).json({
        status: 'Failed',
        message: 'Terjadi kesalahan pada server!',
      });
    }

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil menambahkan saldo baru dengan user id: ${id}`,
      data: saldoUser,
    });
  });
};

module.exports = depo;