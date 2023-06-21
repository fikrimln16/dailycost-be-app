const db = require("../../config/db"); // Impor file database.js

const getCatatanById = (req, res) => {
	const id = req.params.id;

	db.query(
		'SELECT catatan_id, title, body, DATE_FORMAT(created_at, "%d %M %Y") AS created_at, UNIX_TIMESTAMP(created_at) AS created_at_epoch, user_id, url FROM catatan WHERE user_id = ? ORDER BY catatan_id DESC',
		[id],
		(error, results) => {
			if (error) {
				console.error(error);
				return res.status(500).json({
					status: "Failed",
					message: "Terjadi kesalahan pada server",
				});
			}
			//   if (results.length === 0) {
			//     return res.status(404).json({
			//       status: "Failed",
			//       message: "Data Tidak Ada",
			//       data: results
			//     });
			//   }
			return res.status(200).json({
				status: "Succes",
				message: `Berhasil mengambil catatan dengan user id : ${id}`,
				data: results,
			});
		}
	);
};

module.exports = getCatatanById