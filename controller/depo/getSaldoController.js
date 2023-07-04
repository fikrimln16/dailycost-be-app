const depoModel = require('../../models/depo');

/**
 * @swagger
 * /api/saldo/{id}:
 *   get:
 *     summary: Mengambil informasi saldo pengguna berdasarkan ID
 *     tags :
 *       - Depo
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
 *         description: Berhasil mengambil informasi saldo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: Berhasil mengambil data saldo!  
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     uang_gopay:
 *                       type: number
 *                       example: 20000
 *                     uang_cash:
 *                       type: number
 *                       example: 30000
 *                     uang_rekening:
 *                       type: number
 *                       example: 40000
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
 *       404:
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
 *               message: Data tidak ditemukan.
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
 *               message: Terjadi kesalahan.
 */
const getSaldo = (req, res) => {
  const id = req.params.id;

  depoModel.getSaldo(id, (error, saldo, statusCode) => {
    if(statusCode===404){
      return res.status(statusCode).json({
        status: 'Failed',
        message: 'Data tidak ditemukan'
      });
    }
    
    if (error) {
      return res.status(500).json({ 
        status: 'Failed',
        message: 'Terjadi kesalahan.' 
      });
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mengambil data saldo!',
      data: saldo,
    });
  });
};

module.exports = getSaldo 