const express = require("express");
const router = express.Router();
const verifyToken = require("../../auth/verifyToken");
const db = require("../../config/db");

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
router.post("/belanja", verifyToken, (req, res) => {
  const { nama, tanggal, jumlah, pembayaran, user_id } = req.body;
  if(pembayaran == "GOPAY" || pembayaran == "CASH" || pembayaran == "REKENING"){

    try {
      db.query(
        "INSERT INTO pengeluaran VALUES(null, ?, ?, ?, ?, ?) ",
        [nama, tanggal, jumlah, pembayaran, user_id],
        (error, results) => {
          if (error) {
            console.error(error);
            return res.status(400).json({
              status: "Failed",
              message: "Terjadi kesalahan pada input, mohon masukkan data yang benar!",
            });
          }
  
          db.query(
            `SELECT uang_gopay, uang_cash, uang_rekening FROM tabungan WHERE id = ${user_id}`,
            (error, results) => {
              if (error) {
                console.error(error);
                return res.status(400).json({
                  status: "Failed",
                  message: "Terjadi kesalahan input, mohon masukkan data yang benar!",
                });
              }
  
              const uang_gopay = results[0].uang_gopay;
              const uang_cash = results[0].uang_cash;
              const uang_rekening = results[0].uang_rekening;
  
              if (pembayaran == "GOPAY") {
                const uang_gopay_update = uang_gopay - jumlah;
                db.query(
                  `UPDATE tabungan SET uang_gopay = ${uang_gopay_update} WHERE id = ${user_id}`,
                  (error, results) => {
                    if (error) {
                      console.error(error);
                      return res.status(500).json({
                        status: "Failed",
                        message: "Terjadi kesalahan pada server saat melakukan pembelanjaan.",
                      });
                    }
                    return res.status(200).json({
                      status: "Success",
                      message: "Berhasil Membeli Barang!",
                      data: req.body,
                    });
                  }
                );
              } else if (pembayaran == "REKENING") {
                const uang_rekening_update = uang_rekening - jumlah;
                db.query(
                  `UPDATE tabungan SET uang_rekening = ${uang_rekening_update} WHERE id = ${user_id}`,
                  (error, results) => {
                    if (error) {
                      console.error(error);
                      return res.status(500).json({
                        status: "Failed",
                        message: "Terjadi kesalahan pada server saat melakukan pembelanjaan.",
                      });
                    }
  
                    return res.status(200).json({
                      status: "Success",
                      message: "Berhasil Membeli Barang!",
                      data: req.body,
                    });
                  }
                );
              } else if (pembayaran == "CASH") {
                const uang_cash_update = uang_cash - jumlah;
                db.query(
                  `UPDATE tabungan SET uang_cash = ${uang_cash_update} WHERE id = ${user_id}`,
                  (error, results) => {
                    if (error) {
                      console.error(error);
                      return res.status(500).json({
                        status: "Failed",
                        message: "Terjadi kesalahan pada server saat melakukan pembelanjaan.",
                      });
                    }
  
                    return res.status(200).json({
                      status: "Success",
                      message: "Berhasil Membeli Barang!",
                      data: req.body,
                    });
                  }
                );
              } 
            }
          );
        }
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "Failed",
        message: "Terjadi kesalahan pada server saat melakukan pembelanjaan.",
      });
    }
  } else {
    return res.status(400).json({
      status: "Failed",
      message: "Metode pembayaran tidak valid, mohon masukkan data seperti `GOPAY`, `CASH`, atau `REKENING`.",
    });
  }
});


module.exports = router;
