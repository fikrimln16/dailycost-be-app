const express = require('express');
const router = express.Router();
const verifyToken = require('../../auth/verifyToken');
const db = require('../../config/db')


/**
 * @swagger
 * /api/depo:
 *   put:
 *     summary: Mengedit saldo depo pengguna
 *     tags:
 *       - Depo
 *     description: Endpoint untuk mengedit saldo depo pengguna
 *     security:
 *       - BearerAuth: []
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
 *               message: Berhasil mengubah saldo depo
 *               data:
 *                 user_id: 73
 *                 uang_gopay: 20000
 *                 uang_cash: 30000
 *                 uang_rekening: 50000
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
 *               message: "Mohon masukkan data user_id yang benar"
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
router.put('/depo', verifyToken, (req, res) => {
    try {
        const { id, uang_gopay, uang_cash, uang_rekening } = req.body;
        
        db.query('SELECT * FROM tabungan WHERE id = ?', [id], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    status: "Failed",
                    message: `Terjadi kesalahan pada server!`,
                });
            }
            if (results.length === 0) {
                return res.status(401).json({
                    status: "Failed",
                    message: `Mohon masukkan data user_id yang benar!`,
                });
            }
            db.query('UPDATE tabungan SET uang_gopay = ?, uang_cash = ?, uang_rekening = ? WHERE id = ?', [uang_gopay, uang_cash, uang_rekening, id], (error, updateResult) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Terjadi kesalahan.' });
                }
                const saldoUser = {
                    uang_gopay,
                    uang_cash,
                    uang_rekening,
                };
                return res.status(200).json({
                    status: "Success",
                    message: `Berhasil mengubah saldo dengan user id: ${id}`,
                    data: saldoUser
                });
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
});



module.exports = router;