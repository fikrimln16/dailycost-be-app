const express = require('express');
const router = express.Router();
const verifyToken = require('../../auth/verifyToken');
const db = require('../../config/db')

/**
 * @swagger
 * /api/topup:
 *   post:
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
router.post('/topup', verifyToken, (req, res) => {
    const { id, uang_gopay, uang_cash, uang_rekening } = req.body;

    db.query('SELECT uang_gopay, uang_cash, uang_rekening FROM tabungan WHERE id = ?', [id], (error, results) => {
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

        const uang_gopay_old = results[0].uang_gopay;
        const uang_cash_old = results[0].uang_cash;
        const uang_rekening_old = results[0].uang_rekening;

        const uang_gopay_new = parseInt(uang_gopay)+uang_gopay_old;
        const uang_cash_new = parseInt(uang_cash)+uang_cash_old;
        const uang_rekening_new = parseInt(uang_rekening)+uang_rekening_old;

        db.query('UPDATE tabungan SET uang_gopay=?, uang_cash=?, uang_rekening=? WHERE id=?', [uang_gopay_new, uang_cash_new, uang_rekening_new, id], (error, results) => {
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
    
            const saldoUser = {
                "user_id": id,
                "uang_gopay" : uang_gopay_new,
                "uang_cash" : uang_cash_new,
                "uang_rekening" : uang_rekening_new,
            }
    
            return res.status(200).json({
                status: "Succes",
                message:`Berhasil topup saldo, saldo baru dengan user id : ${id} adalah`,
                data: saldoUser
            })
        })
    });
})

module.exports = router;