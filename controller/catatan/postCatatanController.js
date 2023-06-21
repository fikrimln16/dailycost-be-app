const storage = require("../../config/storage");
const catatanModel = require("../../models/catatan");

const postCatatan = (req, res) => {
	const { title, body, date, user_id } = req.body;
	const file = req.file;

	const bucketName = "dailycost-catatan-images";

	if (!file) {
		return res.status(400).json({
			status: "Failed",
			message: "Mohon unggah file gambar!",
		});
	}

	// Buat nama file baru tanpa spasi
	const newFileName = Date.now() + "-" + file.originalname.replace(/\s+/g, "");

	// buat instance bucket
	const myBucket = storage.bucket(bucketName);
	// upload gambar ke bucket
	const blob = myBucket.file(newFileName); // gunakan nama file baru
	const blobStream = blob.createWriteStream({
		metadata: {
			contentType: file.mimetype,
		},
	});

	blobStream.on("error", (err) => {
		console.error(err);
		return res.status(500).json({
			status: "Failed",
			message: "Terjadi kesalahan!",
		});
	});

	let publicUrl = `https://storage.googleapis.com/${bucketName}/${newFileName}`; // gunakan nama file baru
	blobStream.on("finish", () => {
		// set public access untuk file
		blob.makePublic().then(() => {
			// dapatkan public link dari file
			publicUrl = `https://storage.googleapis.com/${bucketName}/${newFileName}`; // gunakan nama file baru

			// Simpan catatan ke database menggunakan model
			catatanModel.createCatatan(
				title,
				body,
				date,
				user_id,
				publicUrl,
				(error, catatanId) => {
					if (error) {
						console.error(error);
						return res.status(500).json({
							status: "Failed",
							message: "Terjadi kesalahan!",
						});
					}

					return res.status(200).json({
						status: "Success",
						message: "Berhasil memasukkan catatan!",
						data: { user_id: user_id, catatan_id: catatanId, url: publicUrl },
					});
				}
			);
		});
	});

	blobStream.end(file.buffer);
};

module.exports = postCatatan;
