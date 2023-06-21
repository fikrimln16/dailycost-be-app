const db = require("../../config/db"); // Impor file database.js


const deleteCatatan = (req, res) => {
	const { user_id, catatan_id } = req.body;

	const bucketName = "dailycost-catatan-images";
	const bucket = storage.bucket(bucketName);

	try {
		db.query(
			"SELECT url FROM catatan WHERE user_id = ? AND catatan_id = ?",
			[user_id, catatan_id],
			(error, result) => {
				if (error) {
					return res.status(404).json({
						status: "Failed",
						message: "Tidak ada catatan yang ditemukan",
					});
				} else if (result.length === 0) {
					return res.status(404).json({
						status: "Failed",
						message: "Catatan tidak ditemukan",
					});
				} else {
					const url = result[0].url;
					db.query(
						"DELETE FROM catatan WHERE user_id = ? AND catatan_id = ?",
						[user_id, catatan_id],
						(error, result) => {
							if (error) {
								return res.status(500).json({
									status: "Failed",
									message: "Terjadi kesalahan pada server",
								});
							} else {
								const fileName = url.substring(url.lastIndexOf("/") + 1);
								const file = bucket.file(fileName);

								// Menghapus gambar dari bucket
								file.delete(function (err) {
									if (err) {
										return res.status(500).json({
											status: "Failed",
											message: "Terjadi kesalahan pada server saat menghapus catatan",
										});
									} else {
										return res.status(200).json({
											status: "Success",
											message: "Catatan berhasil dihapus",
										});
									}
								});
							}
						}
					);
				}
			}
		);
	} catch (error) {
		return res.status(500).json({
			status: "Failed",
			message: "Terjadi kesalahan pada server",
		});
	}
};

module.exports = deleteCatatan