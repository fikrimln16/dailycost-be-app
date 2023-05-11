const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../config/db')

router.post('/', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const query = `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${hashedPassword}')`;

    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error registering user!');
        } else {
            const token = jwt.sign({ email }, 'rahasia');
            db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Error registering user!');
                } else {
                    const id = {
                        id: results[0].id
                    }
                    return res.status(200).json({
                        message : "Berhasil",
                        token,
                        data: id
                    })
                }
            });
        }
    });
});

module.exports = router;