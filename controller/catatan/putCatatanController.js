const catatanModel = require("../../models/catatan");

const putCatatan = (req, res) => {
	const { user_id, catatan_id, title, body } = req.body;

	catatanModel.updateCatatan(
		catatan_id,
		user_id,
		title,
		body,
		(error, updatedCatatan) => {
			if (error) {
				console.error(error);
				return res.status(500).json({
					status: "Failed",
					message: "Terjadi kesalahan pada server!",
				});
			}

			return res.status(200).json({
				status: "Success",
				message: "Catatan berhasil diperbarui",
				data: updatedCatatan,
			});
		}
	);
};

module.exports = putCatatan;
