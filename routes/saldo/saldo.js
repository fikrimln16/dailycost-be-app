const express = require('express');
const router = express.Router();
const verifyToken = require('../../auth/verifyToken');
const db = require('../../config/db')

router.get('/saldo/:id', verifyToken, (req, res) => {
    const id = req.params.id;

    db.query('SELECT uang_gopay, uang_cash, uang_rekening FROM tabungan WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Terjadi kesalahan.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Data tidak ada!' });
        }

        return res.status(200).json({
            results
        });
    });
});

module.exports = router;