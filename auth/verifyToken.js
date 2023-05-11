const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    // Mendapatkan header authorization dari request
    const authHeader = req.headers['authorization'];
    // Mendapatkan token dari header authorization
    const token = authHeader && authHeader.split(' ')[1];
    // Jika token tidak ada, kirim respons dengan status 401 dan pesan 'Token tidak tersedia'
    if (!token) {
    return res.status(401).json({ message: 'Token tidak tersedia' });
    }
    // Memverifikasi token dengan menggunakan secret key
    jwt.verify(token, 'rahasia', (err, decoded) => {
    // Jika terdapat error saat memverifikasi token, kirim respons dengan status 403 dan pesan 'Token tidak valid'
    if (err) {
        return res.status(403).json({ message: 'Token tidak valid' });
    }

    // Menyimpan decoded token ke dalam objek req.user
    req.user = decoded;

    // Melanjutkan proses request
    next();
    });
}

module.exports = verifyToken;