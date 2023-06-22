const catatanModel = require("../../models/catatan");

/**
 * @swagger
 * /api/catatan/{id}:
 *   get:
 *     summary: Mendapatkan catatan berdasarkan ID pengguna
 *     tags:
 *       - Catatan
 *     description: Endpoint untuk mendapatkan catatan berdasarkan ID pengguna
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID pengguna
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan catatan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       catatan_id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       body:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date
 *                       created_at_epoch:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       url:
 *                         type: string
 *             example:
 *               status: Succes
 *               message: "Berhasil mengambil catatan dengan user id : 73"
 *               data:
 *                 - catatan_id: 1
 *                   title: "Catatan 1"
 *                   body: "Ini adalah catatan 1"
 *                   created_at: "2023-06-16"
 *                   created_at_epoch: 1682614800
 *                   user_id: 73
 *                   url: "https://storage.googleapis.com/dailycost-catatan-images/catatan1.jpg"
 *                 - catatan_id: 2
 *                   title: "Catatan 2"
 *                   body: "Ini adalah catatan 2"
 *                   created_at: "2023-06-15"
 *                   created_at_epoch: 1682614800
 *                   user_id: 73
 *                   url: "https://storage.googleapis.com/dailycost-catatan-images/catatan2.jpg"
 *       500:
 *         description: Terjadi kesalahan saat mendapatkan catatan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               status: Failed
 *               message: "Terjadi kesalahan pada server."
 */
const getCatatanById = (req, res) => {
  const id = req.params.id;

  catatanModel.getCatatanById(id, (error, result, statusCode) => {
    if (error) {
      return res.status(statusCode).json({
        status: 'Failed',
        message: error,
      });
    }

    return res.status(statusCode).json({
      status: 'Success',
      message: `Berhasil mengambil catatan dengan user id: ${id}`,
      data: result,
    });
  });
};

module.exports = getCatatanById