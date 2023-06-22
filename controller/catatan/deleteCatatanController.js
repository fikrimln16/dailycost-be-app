const catatanModel = require("../../models/catatan");

/**
 * @swagger
 * /api/catatan:
 *   delete:
 *     summary: Menghapus catatan
 *     description: Endpoint untuk menghapus catatan user dengan catatan_id
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Catatan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               catatan_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Catatan berhasil dibuat
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
 *             example:
 *               status: "Success"
 *               message: "Berhasil menghapus catatan!"
 *       404:
 *         description: Catatan Tidak Ditemukan!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               status: Failed
 *               message: "Catatan Tidak Ditemukan!."
 *       500:
 *         description: Terjadi kesalahan saat membuat catatan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               status: Failed
 *               message: "Terjadi kesalahan pada server"
 */
const deleteCatatan = (req, res) => {
  const { user_id, catatan_id } = req.body;

  catatanModel.deleteCatatan(user_id, catatan_id, (error, message, statusCode) => {
    if (error) {
      return res.status(statusCode).json({
        status: 'Failed',
        message: message,
      });
    } 

    if(statusCode === 404){
      return res.status(statusCode).json({
        status: 'Failed',
        message: message,
      });
    }

    return res.status(statusCode).json({
      status: 'Success',
      message: message,
    });
  });
};

module.exports = deleteCatatan