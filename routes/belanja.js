const express = require("express");
const router = express.Router();
const verifyToken = require("../auth/verifyToken");

const belanjaController = require("../controller/belanja/belanjaController");

/**
 * @swagger
 * /api/belanja:
 *   post:
 *     summary: Melakukan pembelian barang
 *     tags :
 *       - Belanja
 *     description: Menginputkan informasi pembelian barang ke dalam database
 *     security:
 *       - bearerAuth: []
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
router.post("/belanja", verifyToken, belanjaController);

module.exports = router;
