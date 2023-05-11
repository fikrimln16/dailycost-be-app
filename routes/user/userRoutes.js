const express = require('express');
const router = express.Router();
const verifyToken = require('../../auth/verifyToken');
const db = require('../../config/db')

router.get('/', verifyToken, (req, res) => {
  db.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Terjadi kesalahan.' });
    }

    return res.status(200).json({
      results
    });
  })
})

router.post('/id', verifyToken, (req, res) => {
    const email  = req.body;
  
    db.query('SELECT * FROM users WHERE email = ? ', [email], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan.' });
      }
      // if (results.length === 0) {
      //   return res.status(401).json({ message: 'Data Tidak ada' });
      // }
      return res.status(200).json({
        results
      });
    });
  }
)


module.exports = router;