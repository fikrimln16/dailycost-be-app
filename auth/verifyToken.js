const jwt = require("jsonwebtoken");

// function verifyToken(req, res, next) {
//     // Mendapatkan header authorization dari request
//     const authHeader = req.headers["authorization"];
//     // Mendapatkan token dari header authorization
//     const token = authHeader && authHeader.split(" ")[1];
//     // Jika token tidak ada, kirim respons dengan status 401 dan pesan 'Token tidak tersedia'
//     if (!token) {
//         return res.status(401).json({ message: "Token tidak tersedia" });
//     }
//     // Memverifikasi token dengan menggunakan secret key
//     jwt.verify(token, "rahasia", (err, decoded) => {
//         // Jika terdapat error saat memverifikasi token, kirim respons dengan status 403 dan pesan 'Token tidak valid'
//         if (err) {
//             return res.status(403).json({ message: "Token tidak valid" });
//         }

//         // Menyimpan decoded token ke dalam objek req.user
//         req.user = decoded;

//         // Melanjutkan proses request
//         next();
//     });
// }
const verifyToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Token tidak tersedia" });
	}

	jwt.verify(token, "rahasia", (err, decoded) => {
		if (err) {
			return res.status(403).json({ message: "Token tidak valid" });
		}

		// Memeriksa apakah user ID dalam token sesuai dengan nilai req.params.id atau req.body.user_id
		const userId = decoded.id.toString();
		if (userId !== req.params.id) {
			return res.status(401).json({ 
				status: "Failed",
				message: "Akses ditolak, tidak dapat mengambil dengan user_id tersebut!" 
			});
		}

		// Menyimpan decoded token ke dalam objek req.user
		req.user = decoded;

		// Melanjutkan proses request
		next();
	});
};


module.exports = verifyToken;
