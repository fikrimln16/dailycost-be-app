const express = require('express');
const router = express.Router();
const verifyToken = require('../../auth/verifyToken');
const db = require('../../config/db')

router.post('/topup', verifyToken, (req, res) => {
    const { id, uang_gopay, uang_cash, uang_rekening } = req.body;

    db.query('SELECT uang_gopay, uang_cash, uang_rekening FROM tabungan WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Terjadi kesalahan.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Data tidak ada!' });
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
                return res.status(501).json({ message: 'Terjadi kesalahan.' });
            }
    
            if (results.length === 0) {
                return res.status(401).json({ message: 'Data tidak ada!' });
            }
    
            const saldoUser = {
                "uang_gopay" : uang_gopay_new,
                "uang_cash" : uang_cash_new,
                "uang_rekening" : uang_rekening_new,
            }
    
            return res.status(200).json({
                message:"Berhasil mengubah saldo",
                results: saldoUser
            })
        })
    });
})

module.exports = router;