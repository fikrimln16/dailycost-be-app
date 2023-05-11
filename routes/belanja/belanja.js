const express = require('express');
const router = express.Router();
const verifyToken = require('../../auth/verifyToken');
const db = require('../../config/db')

router.post('/belanja', verifyToken, (req, res) => {
    const { nama, tanggal, jumlah, pembayaran, user_id }  = req.body;

    db.query('INSERT INTO pengeluaran VALUES(null, ?, ?, ?, ?, ?) ', [nama, tanggal, jumlah, pembayaran, user_id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Terjadi kesalahan.' });
        }

    db.query(`SELECT uang_gopay, uang_cash, uang_rekening FROM tabungan WHERE id = ${user_id}`, (error, results) => {

        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Terjadi kesalahan.' });
        }

        const uang_gopay = results[0].uang_gopay;
        const uang_cash = results[0].uang_cash;
        const uang_rekening = results[0].uang_rekening;

        if (pembayaran == "GOPAY"){
            const uang_gopay_update = uang_gopay - jumlah
            db.query(`UPDATE tabungan SET uang_gopay = ${uang_gopay_update} WHERE id = ${user_id}`, (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Terjadi kesalahan.' });
            }
            return res.status(200).json({ message: 'Berhasil Membeli Barang!', results });
        })
        } else if (pembayaran == "REKENING"){
            const uang_rekening_update = uang_rekening - jumlah
            db.query(`UPDATE tabungan SET uang_rekening = ${uang_rekening_update} WHERE id = ${user_id}`, (error, results) => {
                if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Terjadi kesalahan.' });
                }
    
                return res.status(200).json({ message: 'Berhasil Membeli Barang!', results });
            })
        } else if (pembayaran == "CASH"){
            const uang_cash_update = uang_cash - jumlah
            db.query(`UPDATE tabungan SET uang_cash = ${uang_cash_update} WHERE id = ${user_id}`, (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Terjadi kesalahan.' });
                }
    
                return res.status(200).json({ message: 'Berhasil Membeli Barang!', results });
            })
        }})
    });
})

module.exports = router;