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
 *                 data:
 *                   type: object
 *                   properties:
 *                     uang_gopay:
 *                       type: number
 *                     uang_cash:
 *                       type: number
 *                     uang_rekening:
 *                       type: number
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan saat mengambil informasi saldo
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
      return res.status(500).json({ message: 'Terjadi kesalahan.' });
    }

    return res.status(200).json({
      status: 'Success',
      data: saldo,
    });
  });
};

module.exports = getSaldo 