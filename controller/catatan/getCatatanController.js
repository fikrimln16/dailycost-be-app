const db = require("../../config/db"); // Impor file database.js

const getCatatan = (req, res) => {
	db.query("SELECT * FROM catatan", (error, results) => {
		if (error) {
			console.error(error);
			return res.status(500).json({ message: "Terjadi kesalahan." });
		}
		if (results.length === 0) {
			return res.status(404).json({ status: "Data Tidak Ada", data: [] });
		}
		return res.status(200).json({
			status: "Success",
			message: "Berhasil Mengambil Catatan!",
			data: results,
		});
	});
};

module.exports = getCatatan