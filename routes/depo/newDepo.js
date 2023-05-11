const express = require('express');
const router = express.Router();
const verifyToken = require('../../auth/verifyToken');
const db = require('../../config/db')

router.post('/newdepo', verifyToken, (req, res) => {
    const { id, uang_gopay, uang_cash, uang_rekening } = req.body;

    db.query('INSERT INTO tabungan VALUES (?,?,?,?)', [id, uang_gopay, uang_cash, uang_rekening], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(501).json({ message: 'Terjadi kesalahan.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Data tidak ada!' });
        }

        const saldoUser = {
            "uang_gopay" : uang_gopay,
            "uang_cash" : uang_cash,
            "uang_rekening" : uang_rekening
        }

        return res.status(200).json({
            message:"Berhasil mengubah saldo",
            data: saldoUser
        })
    })
})

module.exports = router;