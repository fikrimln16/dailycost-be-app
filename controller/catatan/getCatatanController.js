const catatanModel = require("../../models/catatan");

const getCatatan = (req, res) => {
	catatanModel.getCatatan((error, results) => {
		if (error) {
			console.error(error);
			return res
				.status(500)
				.json({ status: "Failed", message: "Terjadi kesalahan." });
		}
		if (results.length === 0) {
			return res
				.status(404)
				.json({ status: "Failed", message: "Data tidak ada!", data: [] });
		}
		return res.status(200).json({
			status: "Success",
			message: "Berhasil Mengambil Catatan!",
			data: results,
		});
	});
};

module.exports = getCatatan;
